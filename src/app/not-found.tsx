import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shown for unknown URLs and whenever a route calls notFound() — most often a
 * blog slug that no longer exists in mjqapp.
 *
 * Note: on a prerendered/streamed route Next.js cannot set a 404 status after
 * the response has started, so it injects <meta name="robots" content="noindex">
 * instead. That tag is what keeps these pages out of search results.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fino
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fino-logo.svg" alt="Fino Premium Touch" className="h-7 w-auto" />
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <p className="text-sm font-medium tracking-widest text-muted-foreground">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tighter md:text-5xl">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">
          The page may have moved, or the link may be out of date.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Browse the range
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </main>
  );
}
