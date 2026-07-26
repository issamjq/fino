/**
 * Canonical public origin for the catalog.
 *
 * The apex 308-redirects to www, so www is the canonical host — everything
 * that emits an absolute URL (metadataBase, sitemap, OpenGraph, canonicals)
 * must agree on this one value.
 *
 * Override per-environment with NEXT_PUBLIC_SITE_URL — useful on preview
 * deploys so they don't advertise the production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.finocosmetics.ae"
).replace(/\/+$/, "");
