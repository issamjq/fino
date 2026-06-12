"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { brand, products } from "@/lib/products";
import { ProductPlaceholder } from "@/components/product-placeholder";
import { DownloadPdfButton } from "@/components/sections/download-pdf-button";

function AccordionItem({
  product,
  isActive,
  onActivate,
}: {
  product: (typeof products)[number];
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <a
      href={`#${product.id}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={cn(
        "group relative h-[420px] md:h-[460px] shrink-0 overflow-hidden rounded-3xl border border-border cursor-pointer",
        "bg-gradient-to-b from-zinc-50 to-white",
        "transition-[width] duration-700 ease-in-out",
        isActive ? "w-[260px] md:w-[360px]" : "w-[64px] md:w-[72px]"
      )}
    >
      {/* Pack */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        <ProductPlaceholder product={product} />
      </div>

      {/* Size chip (active) */}
      <span
        className={cn(
          "absolute top-5 left-5 rounded-full border border-border bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground/60 backdrop-blur transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        {product.size}
      </span>

      {/* Caption */}
      <span
        className={cn(
          "absolute whitespace-nowrap font-semibold tracking-tight text-foreground transition-all duration-300 ease-in-out",
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0 text-xl"
            : "bottom-28 left-1/2 -translate-x-1/2 rotate-90 text-base text-foreground/70"
        )}
      >
        {product.name}
      </span>
    </a>
  );
}

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center bg-background"
    >
      <DownloadPdfButton className="absolute right-4 top-4 z-20 md:right-8 md:top-8" />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row md:gap-8">
          {/* Left: copy */}
          <div className="w-full text-center md:w-1/2 md:text-left">
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground/60">
              {brand.origin} · Distributed by {brand.distributor}
            </span>
            <h1 className="mt-6">
              <Image
                src="/fino-logo.svg"
                alt={`${brand.name} ${brand.line}`}
                width={300}
                height={145}
                priority
                className="mx-auto h-20 w-auto md:mx-0 md:h-28"
              />
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:mx-0">
              {products.length} premium hair-care essentials, made in{" "}
              {brand.origin} — explore the full {brand.name} {brand.line} range.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <a
                href={`#${products[0].id}`}
                className="inline-flex items-center rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition-colors duration-300 hover:bg-primary/90"
              >
                Explore the range
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-xl border border-border px-7 py-3 font-semibold text-foreground transition-colors duration-300 hover:bg-muted"
              >
                Contact MJQ
              </a>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="w-full md:w-1/2">
            <div className="no-scrollbar flex flex-row items-center justify-center gap-3 overflow-x-auto p-2 md:gap-4">
              {products.map((product, index) => (
                <AccordionItem
                  key={product.id}
                  product={product}
                  isActive={index === activeIndex}
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
