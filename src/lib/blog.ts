/**
 * Blog content for the catalog.
 *
 * Posts are HARDCODED — bundled from ./blog-posts.json, a snapshot of the
 * published Fino posts exported from the mjqapp manager. To update the blog,
 * re-export the JSON (see the mjqapp read API: /api/posts?brand=fino) and
 * commit it. Bodies are rich HTML, rendered via render-post.ts.
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

// hardcoded posts, bundled at build time from ./blog-posts.json
const POSTS: BlogPost[] = postsData as BlogPost[];

const sortByDate = (list: BlogPost[]) =>
  [...list].sort((a, b) => (a.date < b.date ? 1 : -1));

/** all published posts, newest first */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  return sortByDate(POSTS);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
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
