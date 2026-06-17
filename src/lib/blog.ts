/**
 * Blog content for the catalog.
 *
 * Source of truth is the mjqapp manager (Neon DB) exposed via a key-protected
 * read API. We fetch it server-side with ISR so posts created/edited in mjqapp
 * appear automatically. If the API isn't configured (env unset) or is
 * unreachable, we fall back to the bundled ./blog-posts.json snapshot so the
 * site always renders.
 *
 * Env (server-only — never NEXT_PUBLIC):
 *   MJQAPP_API_URL   base url of the manager app, e.g. https://mjqapp.vercel.app
 *   MJQAPP_READ_KEY  shared read key (matches mjqapp's read key)
 *   MJQAPP_BRAND     which company's posts to show (defaults to "fino")
 */

import postsData from "./blog-posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  /** plain text; blank lines separate paragraphs */
  body: string;
  /** cover image URL (any host) */
  cover: string;
  author: string;
  views: number;
  readMinutes: number;
  /** ISO date string (published date) */
  date: string;
};

const API_BASE = process.env.MJQAPP_API_URL;
const READ_KEY = process.env.MJQAPP_READ_KEY;
// which company's posts this catalog shows (mjqapp groups posts by brand)
const BRAND = process.env.MJQAPP_BRAND || "fino";
const REVALIDATE = 30; // seconds — ISR refresh interval for the post list/cards

const isApiConfigured = Boolean(API_BASE && READ_KEY);

// bundled offline fallback — snapshot of published posts (./blog-posts.json)
const FALLBACK: BlogPost[] = postsData as BlogPost[];

type ApiPost = {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  coverUrl: string;
  author: string;
  readMinutes: number;
  views: number;
  date: string | null;
};

const fromApi = (p: ApiPost): BlogPost => ({
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  body: p.body ?? "",
  cover: p.coverUrl || "",
  author: p.author || "Fino",
  views: p.views ?? 0,
  readMinutes: p.readMinutes ?? 1,
  date: p.date ?? new Date(0).toISOString(),
});

async function apiFetch(path: string): Promise<Response | null> {
  if (!isApiConfigured) return null;
  try {
    return await fetch(`${API_BASE}${path}`, {
      headers: { "x-api-key": READ_KEY as string },
      next: { revalidate: REVALIDATE, tags: ["posts"] },
    });
  } catch {
    return null; // network error → caller falls back to the bundled snapshot
  }
}

const sortByDate = (list: BlogPost[]) =>
  [...list].sort((a, b) => (a.date < b.date ? 1 : -1));

/** all published posts, newest first */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const res = await apiFetch(`/api/posts?brand=${encodeURIComponent(BRAND)}`);
  if (!res || !res.ok) return sortByDate(FALLBACK);
  try {
    const data = (await res.json()) as { posts: ApiPost[] };
    return sortByDate((data.posts ?? []).map(fromApi));
  } catch {
    return sortByDate(FALLBACK);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isApiConfigured) return FALLBACK.find((p) => p.slug === slug) ?? null;
  const res = await apiFetch(
    `/api/posts/${encodeURIComponent(slug)}?brand=${encodeURIComponent(BRAND)}`
  );
  if (!res) return FALLBACK.find((p) => p.slug === slug) ?? null;
  if (res.status === 404) return null;
  if (!res.ok) return FALLBACK.find((p) => p.slug === slug) ?? null;
  try {
    const data = (await res.json()) as { post: ApiPost };
    return data.post ? fromApi(data.post) : null;
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}

// ── related posts ──

const STOPWORDS = new Set([
  "the", "and", "for", "are", "with", "that", "this", "from", "you", "your",
  "but", "not", "all", "our", "out", "has", "have", "was", "were", "they",
  "their", "what", "when", "who", "how", "why", "one", "two", "three", "its",
  "it's", "into", "than", "then", "more", "most", "some", "each", "per", "a",
  "an", "of", "to", "in", "on", "is", "as", "at", "by", "or", "we", "be",
]);

/** word set used to measure similarity between two posts */
const keywords = (p: BlogPost): Set<string> => {
  const text = `${p.title} ${p.title} ${p.subtitle} ${p.body}`.toLowerCase();
  const out = new Set<string>();
  for (const w of text.match(/[a-z0-9']{3,}/g) ?? []) {
    if (!STOPWORDS.has(w)) out.add(w);
  }
  return out;
};

/**
 * Up to `limit` posts most similar to `slug`, by shared keywords in
 * title/subtitle/body (title counts double). Ties — and any remaining
 * slots when there aren't enough matches — fall back to newest posts.
 */
export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  const current = posts.find((p) => p.slug === slug);
  const others = posts.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);

  const base = keywords(current);
  const scored = others
    .map((p) => {
      const words = keywords(p);
      let overlap = 0;
      for (const w of words) if (base.has(w)) overlap++;
      return { post: p, score: overlap };
    })
    // newest-first as the tiebreak (others already sorted by date desc)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

/** split the plain-text body into paragraphs (blank line separated) */
export const toParagraphs = (body: string) =>
  body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export const formatDate = (iso: string, long = false) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};
