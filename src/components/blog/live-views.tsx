"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

// fetched once per page load and shared across every card on the page
let viewsPromise: Promise<Record<string, number>> | null = null;
function loadViews(): Promise<Record<string, number>> {
  if (!viewsPromise) {
    viewsPromise = fetch("/api/views")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) =>
        d && typeof d.views === "object" && d.views ? d.views : {}
      )
      .catch(() => ({}));
  }
  return viewsPromise;
}

/**
 * View count for a post card. Renders the bundled `initialViews` immediately,
 * then swaps in the live count from mjqapp (via /api/views), so the number
 * reflects real traffic even though post content is hardcoded.
 */
export function LiveViews({
  slug,
  initialViews,
}: {
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    let active = true;
    loadViews().then((map) => {
      if (active && typeof map[slug] === "number") setViews(map[slug]);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views}
    </span>
  );
}
