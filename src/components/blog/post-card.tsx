import Link from "next/link";
import { Eye } from "lucide-react";
import { type BlogPost, formatDate } from "@/lib/blog";
import { ShareButton } from "@/components/blog/share-button";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md">
      {/* whole-card click target — opens the post (covers everything) */}
      <Link
        href={`/blog/${post.slug}`}
        aria-label={post.title}
        className="absolute inset-0 z-10"
      />

      <div className="relative h-44 w-full overflow-hidden bg-muted lg:h-48">
        {/* plain img: cover URLs can come from any host (managed in mjqapp) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1.5 px-4 pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground group-hover:underline">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.subtitle}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          {post.views}
        </span>
        {/* lifted above the card link so Share stays independently clickable */}
        <div className="relative z-20">
          <ShareButton slug={post.slug} title={post.title} />
        </div>
      </div>
    </article>
  );
}
