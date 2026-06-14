import { NextResponse } from "next/server";

/**
 * Read-only live view counts for the (hardcoded) blog posts. Proxies mjqapp's
 * published-posts list and returns a { slug: views } map, keeping the read key
 * server-side. The post content is bundled at build time, but views are live —
 * the card/detail counters use this so the number reflects real traffic.
 */
export const dynamic = "force-dynamic";

const API = process.env.MJQAPP_API_URL;
const KEY = process.env.MJQAPP_READ_KEY;
const BRAND = process.env.MJQAPP_BRAND || "fino";

export async function GET() {
  if (!API || !KEY) return NextResponse.json({ views: {} });
  try {
    const res = await fetch(
      `${API}/api/posts?brand=${encodeURIComponent(BRAND)}`,
      { headers: { "x-api-key": KEY }, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ views: {} });
    const data = (await res.json()) as {
      posts?: { slug: string; views?: number }[];
    };
    const views: Record<string, number> = {};
    for (const p of data.posts ?? []) {
      if (p && typeof p.slug === "string") {
        views[p.slug] = typeof p.views === "number" ? p.views : 0;
      }
    }
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: {} });
  }
}
