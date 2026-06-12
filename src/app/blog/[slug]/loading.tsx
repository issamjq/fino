import { ArrowLeft } from "lucide-react";

/** Shown automatically while a blog post loads (Next.js loading UI). */
export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-12">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fino-logo.svg" alt="Fino Premium Touch" className="h-7 w-auto" />
        </div>
      </header>

      <article className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
        {/* meta + share */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        {/* title + subtitle */}
        <div className="h-10 w-11/12 animate-pulse rounded-lg bg-muted md:h-12" />
        <div className="mt-3 h-10 w-2/3 animate-pulse rounded-lg bg-muted md:h-12" />
        <div className="mt-5 h-5 w-3/4 animate-pulse rounded bg-muted" />

        {/* body lines */}
        <div className="mt-10 space-y-4">
          {[
            "w-full", "w-11/12", "w-full", "w-5/6",
            "w-full", "w-10/12", "w-full", "w-2/3",
          ].map((w, i) => (
            <div key={i} className={`h-5 ${w} animate-pulse rounded bg-muted`} />
          ))}
        </div>

        {/* footer */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </article>
    </main>
  );
}
