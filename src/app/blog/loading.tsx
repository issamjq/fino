import { ArrowLeft } from "lucide-react";

/** Shown automatically while the blog list loads (Next.js loading UI). */
export default function BlogIndexLoading() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-12">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Home
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fino-logo.svg" alt="Fino Premium Touch" className="h-7 w-auto" />
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 md:px-12">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-10 w-56 animate-pulse rounded-lg bg-muted md:h-12" />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="h-44 w-full animate-pulse bg-muted lg:h-48" />
      <div className="flex flex-col gap-2.5 px-4 pt-3">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
