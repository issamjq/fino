import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllSlugs, formatDate, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { renderPostBody } from "@/lib/render-post";
import { ShareButton } from "@/components/blog/share-button";
import { ViewCounter } from "@/components/blog/view-counter";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ContactFooter } from "@/components/sections/contact-footer";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;
export const dynamicParams = true; // posts added after build still render on-demand

// pre-render known posts at build time
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Fino Premium Touch" };
  return {
    title: `${post.title} — Fino Premium Touch`,
    description: post.subtitle,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: post.cover ? [post.cover] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const bodyHtml = renderPostBody(post.body);
  const related = await getRelatedPosts(post.slug, 3);

  return (
    <main className="min-h-screen bg-background">
      {/* top bar */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-12">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fino-logo.svg" alt="Fino Premium Touch" className="h-7 w-auto" />
        </div>
      </header>

      <article className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
        {/* meta + share */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date, true)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readMinutes} min read
            </span>
          </div>
          <ShareButton slug={post.slug} title={post.title} />
        </div>

        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.subtitle}</p>

        {/* body (sanitized rich text from the editor) */}
        <div
          className="post-body mt-8 text-lg leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* footer row */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
          <ViewCounter slug={post.slug} initialViews={post.views} />
          <ShareButton slug={post.slug} title={post.title} />
        </div>
      </article>

      {/* similar posts */}
      <RelatedPosts posts={related} />

      {/* shared contact footer */}
      <ContactFooter />
    </main>
  );
}
