"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCatalogPdf } from "@/lib/generate-catalog-pdf";

/**
 * Downloads a real (vector) PDF of the catalog — drawn with the jsPDF API, not
 * screenshotted — so text stays crisp at any zoom. One click, no print dialog.
 */
export function DownloadPdfButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await generateCatalogPdf();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      aria-label="Download catalog as PDF"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted disabled:opacity-70",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {loading ? "Preparing…" : "Download PDF"}
    </button>
  );
}
