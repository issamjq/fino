import { NextResponse } from "next/server";

/**
 * Proxies a view-count bump to mjqapp, keeping the read key server-side.
 * The post page pings this once per session. Returns the new count (or null
 * when the API isn't configured / unreachable).
 */
const API = process.env.MJQAPP_API_URL;
const KEY = process.env.MJQAPP_READ_KEY;

export async function POST(req: Request) {
  let slug = "";
  try {
    const body = (await req.json()) as { slug?: string };
    slug = body.slug ?? "";
  } catch {
    /* ignore */
  }
  if (!slug) return NextResponse.json({ views: null }, { status: 400 });
  if (!API || !KEY) return NextResponse.json({ views: null });

  try {
    const res = await fetch(`${API}/api/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      headers: { "x-api-key": KEY },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ views: null });
    const data = (await res.json()) as { views?: number };
    return NextResponse.json({ views: typeof data.views === "number" ? data.views : null });
  } catch {
    return NextResponse.json({ views: null });
  }
}
