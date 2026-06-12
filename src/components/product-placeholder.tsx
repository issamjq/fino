import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

/**
 * Pack visual for a product. When `product.image` is set (the real
 * photography) it's shown directly; otherwise a minimalist bottle in the
 * product's accent colour stands in, so swapping art later is a one-line
 * data change with no component edits.
 *
 * Sizing: fills its parent (use a sized, positioned wrapper). `compact` drops
 * the smaller label lines for tight spots (thumbnails).
 */
export function ProductPlaceholder({
  product,
  compact = false,
  className,
}: {
  product: Product;
  compact?: boolean;
  className?: string;
}) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.fullName}
        fill
        sizes="420px"
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      aria-label={`${product.fullName} — image coming soon`}
    >
      {/* faux bottle */}
      <div
        className="relative flex aspect-[3/7] h-[92%] max-h-full flex-col items-center justify-end overflow-hidden rounded-[18%_18%_22%_22%/8%_8%_10%_10%] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)]"
        style={{
          background: `linear-gradient(160deg, ${product.accent} 0%, ${product.accent}cc 45%, ${product.accent}99 100%)`,
        }}
      >
        <span className="pointer-events-none absolute left-[14%] top-[6%] h-[60%] w-[14%] rounded-full bg-white/25 blur-[2px]" />
        <span
          className="absolute -top-px left-1/2 h-[9%] w-[42%] -translate-x-1/2 rounded-b-[40%] rounded-t-lg"
          style={{ background: "rgba(0,0,0,0.28)" }}
        />
        <div className="mb-[16%] flex w-[78%] flex-col items-center gap-1 rounded-xl bg-white/95 px-3 py-3 text-center shadow-sm backdrop-blur">
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: product.accent }}
          >
            Fino
          </span>
          {!compact && (
            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#9ca3af]">
              Premium Touch
            </span>
          )}
          <span className="mt-0.5 text-[clamp(0.7rem,1.6vw,0.95rem)] font-semibold leading-tight tracking-tight text-[#0a0a0a]">
            {product.name}
          </span>
          {!compact && (
            <span className="mt-0.5 rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[#6b7280]">
              {product.size}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
