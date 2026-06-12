"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Shows the view count and bumps it once per browser session (sessionStorage),
 * so refreshing the page doesn't keep counting. Live-updates to the value
 * returned by the server.
 */
export function ViewCounter({
  slug,
  initialViews,
}: {
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `pv:${slug}`;
    if (sessionStorage.getItem(key)) return; // already counted this session
    sessionStorage.setItem(key, "1");

    fetch("/api/track-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.views === "number") setViews(d.views);
      })
      .catch(() => {});
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views} views
    </span>
  );
}
