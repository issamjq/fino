import { type BlogPost } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";

/** "Keep reading" — up to 3 similar posts shown at the bottom of a post. */
export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="container mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Keep reading
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tighter md:text-3xl">
          Similar posts
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
