import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { brand, products } from "@/lib/products";

export function Feature() {
  return (
    <div id="brand" className="flex min-h-[100svh] w-full flex-col justify-center pt-10 pb-32 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="container mx-auto grid grid-cols-1 items-center gap-6 rounded-2xl border border-border bg-background p-5 sm:gap-8 sm:p-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center gap-6 sm:gap-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div>
                <Badge variant="outline">The Brand</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="max-w-xl text-left text-2xl font-semibold tracking-tighter sm:text-3xl lg:text-4xl">
                  Premium Japanese hair care.
                </h2>
                <p className="max-w-xl text-left text-base leading-relaxed tracking-tight text-muted-foreground sm:text-lg">
                  {brand.name} {brand.line} is distributed across the region by{" "}
                  {brand.distributor} — a single {brand.origin}-made line of{" "}
                  {products.length} salon-grade hair essentials.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 items-start gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-5">
              {products.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="flex flex-row items-start gap-3 group sm:gap-6"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm font-medium group-hover:underline sm:text-base">
                    {p.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
          <div className="flex aspect-[5/3] min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-[#fff0f6] to-[#fce7f0] p-6 sm:aspect-square sm:gap-6 sm:p-10 lg:aspect-auto">
            <Image
              src="/fino-logo.svg"
              alt={`${brand.name} ${brand.line}`}
              width={360}
              height={174}
              className="h-auto w-1/2 max-w-[320px] sm:w-2/3"
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
              Made in {brand.origin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
