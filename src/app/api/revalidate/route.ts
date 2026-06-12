import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Revalidation webhook called by mjqapp when a post is created / edited /
 * deleted. Secured by a shared secret (REVALIDATE_SECRET, matches mjqapp's
 * CATALOG_REVALIDATE_SECRET). Refreshes the cached blog pages immediately.
 *
 * Body: { "secret": "…", "slug"?: "…" }
 */
export async function POST(req: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  let body: { secret?: string; slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* allow empty body */
  }

  if (body.secret !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // refresh the list + homepage section, and the specific post if given
  revalidatePath("/");
  revalidatePath("/blog");
  if (body.slug) revalidatePath(`/blog/${body.slug}`);

  return NextResponse.json({ ok: true, revalidated: true, slug: body.slug ?? null });
}
