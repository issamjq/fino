import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";

/**
 * Homepage blog section (sits above the contact/footer). Shows the latest
 * posts; each card opens its own page at /blog/[slug].
 */
export async function Blog() {
  const latest = (await getPublishedPosts()).slice(0, 6);

  if (latest.length === 0) return null;

  return (
    <section
      id="blog"
      className="flex min-h-screen flex-col justify-center pt-12 pb-40 lg:pt-16 lg:pb-44"
    >
      <div className="container mx-auto px-4 md:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              From the blog
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tighter md:text-4xl">
              Latest posts
            </h2>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            All posts →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
