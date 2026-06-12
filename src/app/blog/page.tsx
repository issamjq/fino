import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
  title: "Blog — Fino Premium Touch",
  description: "News and stories from Fino Premium Touch, distributed by MJQ.",
};

export const revalidate = 30;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fino-logo.svg" alt="Fino Premium Touch" className="h-7 w-auto" />
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 md:px-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          The blog
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tighter md:text-5xl">
          All posts
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
