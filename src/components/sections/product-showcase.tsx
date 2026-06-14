"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { brand, products } from "@/lib/products";
import { ProductPlaceholder } from "@/components/product-placeholder";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-1.5 last:border-b-0 sm:py-3">
      <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
        {label}
      </span>
      <span className="text-right text-xs font-semibold tracking-tight text-foreground sm:text-sm">
        {value}
      </span>
    </div>
  );
}

/**
 * A single section that handles all 5 products: a dark index on the left
 * selects the product; the right shows a flip card (pack on the front, full
 * spec sheet on the back). Deep links from the hero/dock (e.g. #shampoo) are
 * honoured via the URL hash, so one section still selects any product.
 */
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // sync the selected product with the URL hash (#hair-mask, #shampoo, …)
  useEffect(() => {
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = products.findIndex((p) => p.id === id);
      if (i >= 0) {
        setActive(i);
        setFlipped(false);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const select = (i: number) => {
    setActive(i);
    setFlipped(false);
  };

  const product = products[active];

  return (
    <div className="relative mx-auto w-full max-w-7xl md:p-8">
      {/* invisible scroll anchors so #hair-mask, #shampoo, … land on this section */}
      {products.map((p) => (
        <span
          key={p.id}
          id={p.id}
          aria-hidden
          className="pointer-events-none absolute -top-24"
        />
      ))}

      <div className="relative flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-border sm:min-h-[520px] sm:rounded-[2.5rem] lg:h-[72vh] lg:max-h-[700px] lg:min-h-0 lg:flex-row lg:rounded-[3rem]">
        {/* ── Left: Fino range index (selects the product) ── */}
        <div className="relative z-30 flex w-full flex-col justify-center gap-1.5 overflow-hidden bg-gradient-to-br from-[#a8154f] to-[#5f0d29] px-5 py-5 sm:gap-2 sm:px-8 sm:py-10 md:px-16 lg:h-full lg:w-[40%] lg:pl-16">
          <span className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40 sm:mb-4 sm:text-[11px]">
            {brand.name} {brand.line}
          </span>
          {products.map((p, i) => {
            const isActive = i === active;
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                onClick={() => select(i)}
                className={cn(
                  "group flex items-center gap-3 rounded-full border px-4 py-2 transition-all duration-500 sm:gap-4 sm:px-6 sm:py-3",
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
                  style={isActive ? { background: p.accent } : undefined}
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

        {/* ── Right: flip card for the selected product ── */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden border-t border-border bg-secondary px-6 py-5 sm:min-h-[460px] sm:py-12 md:px-12 lg:h-full lg:min-h-0 lg:border-l lg:border-t-0 lg:py-8">
          <div className="relative aspect-[4/5] w-full max-w-[190px] [perspective:1600px] sm:max-w-[360px] lg:max-w-[420px]">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="relative h-full w-full cursor-pointer rounded-[2rem] [transform-style:preserve-3d] transition-transform duration-700 md:rounded-[2.5rem]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* FRONT — pack */}
              <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border-4 border-white bg-white [backface-visibility:hidden] sm:rounded-[2rem] sm:border-8 md:rounded-[2.5rem]">
                <div key={product.id} className="absolute inset-0 animate-[fadeIn_0.4s_ease] p-4 sm:p-6">
                  <ProductPlaceholder product={product} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-6">
                  <div className="w-fit rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground shadow-sm">
                    {active + 1} • {product.name}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Tap to see details →
                  </p>
                </div>
              </div>

              {/* BACK — spec sheet */}
              <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border-4 border-white bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-[2rem] sm:border-8 md:rounded-[2.5rem]">
                <div className="flex h-full flex-col p-4 sm:p-7">
                  <span
                    className="h-1.5 w-10 rounded-full sm:w-12"
                    style={{ background: product.accent }}
                  />
                  <h3 className="mt-3 text-lg font-semibold leading-tight tracking-tighter text-foreground sm:mt-4 sm:text-2xl">
                    {product.fullName}
                  </h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                    {product.tagline}
                  </p>
                  <div className="mt-2 flex flex-1 flex-col justify-center sm:mt-3">
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
