import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { brand, products } from "@/lib/products";

export function Feature() {
  return (
    <div id="brand" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 rounded-2xl border border-border bg-background p-8 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div>
                <Badge variant="outline">The Brand</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="max-w-xl text-left text-3xl font-semibold tracking-tighter lg:text-5xl">
                  Premium Japanese hair care.
                </h2>
                <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground">
                  {brand.name} {brand.line} is distributed across the region by{" "}
                  {brand.distributor} — a single {brand.origin}-made line of{" "}
                  {products.length} salon-grade hair essentials.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:pl-6">
              {products.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="flex flex-row items-start gap-6 group"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-medium group-hover:underline">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.size} · {p.cartonSize} per carton
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="flex aspect-square flex-col items-center justify-center gap-6 rounded-xl bg-gradient-to-br from-[#fff0f6] to-[#fce7f0] p-10">
            <Image
              src="/fino-logo.svg"
              alt={`${brand.name} ${brand.line}`}
              width={360}
              height={174}
              className="h-auto w-2/3 max-w-[320px]"
            />
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Made in {brand.origin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
