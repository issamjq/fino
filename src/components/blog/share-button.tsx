"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** small inline brand glyphs (lucide 1.x dropped brand icons) */
const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
  </svg>
);
const XLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
  </svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
  </svg>
);

export function ShareButton({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const url = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;

  const openShare = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=540");

  const onShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // use the native share sheet when available (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: url() });
        return;
      } catch {
        /* user cancelled — fall through to popover */
      }
    }
    setOpen((o) => !o);
  };

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={onShareClick}
        aria-label="Share"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 z-50 mb-2 flex items-center gap-1 rounded-xl border border-border bg-white p-1.5 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Share on Facebook"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openShare(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`
              );
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1877F2] transition-colors hover:bg-muted"
          >
            <Facebook />
          </button>
          <button
            type="button"
            aria-label="Share on X"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openShare(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(url())}&text=${encodeURIComponent(title)}`
              );
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <XLogo />
          </button>
          <button
            type="button"
            aria-label="Share on LinkedIn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openShare(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`
              );
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0A66C2] transition-colors hover:bg-muted"
          >
            <LinkedIn />
          </button>
          <span className="mx-0.5 h-5 w-px bg-border" />
          <button
            type="button"
            aria-label="Copy link"
            onClick={copy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
