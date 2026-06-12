"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { brand, products, type Product } from "@/lib/products";
import { ProductPlaceholder } from "@/components/product-placeholder";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-semibold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}

/**
 * One full-viewport product section: a persistent dark index of the whole
 * range on the left (current item highlighted, others link-jump via snap),
 * and a flip card on the right — front shows the pack, back shows the spec
 * sheet (barcode, origin, carton, size, price).
 */
export function ProductSection({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="mx-auto w-full max-w-7xl md:p-8">
      <div className="relative flex min-h-[520px] flex-col overflow-hidden rounded-[2.5rem] border border-border lg:h-[72vh] lg:max-h-[700px] lg:min-h-0 lg:flex-row lg:rounded-[3rem]">
        {/* ── Left: dark range index ── */}
        <div className="relative z-30 flex w-full flex-col justify-center gap-2 overflow-hidden bg-[#0a0a0a] px-8 py-10 md:px-16 lg:h-full lg:w-[40%] lg:pl-16">
          <span className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
            {brand.name} {brand.line}
          </span>
          {products.map((p, i) => {
            const isActive = p.id === product.id;
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                className={cn(
                  "group flex items-center gap-4 rounded-full border px-6 py-3 transition-all duration-500",
                  isActive
                    ? "border-white bg-white text-[#0a0a0a]"
                    : "border-white/15 bg-transparent text-white/55 hover:border-white/40 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-500",
                    isActive ? "text-white" : "bg-white/10 text-white/50"
                  )}
                  style={isActive ? { background: product.accent } : undefined}
                >
                  {i + 1}
                </span>
                <span className="whitespace-nowrap text-sm font-medium uppercase tracking-tight md:text-[15px]">
                  {p.name}
                </span>
              </a>
            );
          })}
        </div>

        {/* ── Right: flip card ── */}
        <div className="relative flex min-h-[460px] flex-1 items-center justify-center overflow-hidden border-t border-border bg-secondary px-6 py-12 md:px-12 lg:h-full lg:min-h-0 lg:border-l lg:border-t-0 lg:py-8">
          <div className="relative aspect-[4/5] w-full max-w-[420px] [perspective:1600px]">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="relative h-full w-full cursor-pointer rounded-[2rem] [transform-style:preserve-3d] transition-transform duration-700 md:rounded-[2.5rem]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* FRONT — pack */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-8 border-white bg-white [backface-visibility:hidden] md:rounded-[2.5rem]">
                <div className="absolute inset-0 p-6">
                  <ProductPlaceholder product={product} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                  <div className="w-fit rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground shadow-sm">
                    {index + 1} • {product.name}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Tap to see details →
                  </p>
                </div>
              </div>

              {/* BACK — spec sheet */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-8 border-white bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] md:rounded-[2.5rem]">
                <div className="flex h-full flex-col p-7">
                  <span
                    className="h-1.5 w-12 rounded-full"
                    style={{ background: product.accent }}
                  />
                  <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tighter text-foreground">
                    {product.fullName}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {product.tagline}
                  </p>
                  <div className="mt-3 flex flex-1 flex-col justify-center">
                    <SpecRow label="Barcode" value={product.barcode} />
                    <SpecRow label="Origin" value={product.origin} />
                    <SpecRow label="Carton size" value={`${product.cartonSize} units`} />
                    <SpecRow label="Unit size" value={product.size} />
                    <SpecRow label="Price" value={product.price ?? "On request"} />
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    ← Back to pack
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
