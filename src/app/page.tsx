import { Hero } from "@/components/sections/hero";
import { Feature } from "@/components/sections/feature";
import { ProductSection } from "@/components/sections/product-showcase";
import { Dock } from "@/components/sections/dock";
import { Blog } from "@/components/sections/blog";
import { ContactFooter } from "@/components/sections/contact-footer";
import { brand, products } from "@/lib/products";

// ISR: re-generate so the blog cards (incl. live view counts) stay fresh
export const revalidate = 30;

export default function Home() {
  return (
    <main className="relative flex flex-col overflow-x-clip pb-32">
      <Hero />
      <Feature />

      {products.map((product, index) => (
        <section
          key={product.id}
          id={product.id}
          className="flex min-h-[100svh] flex-col justify-center py-6"
        >
          <div className="container mx-auto mb-4 px-4 md:mb-6 md:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {brand.name} {brand.line}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tighter md:text-4xl">
              {product.name}
            </h2>
          </div>
          <div className="px-4">
            <ProductSection product={product} index={index} />
          </div>
        </section>
      ))}

      {/* Blog (above the footer) */}
      <Blog />

      {/* Contact */}
      <ContactFooter id="contact" />

      <Dock />
    </main>
  );
}
