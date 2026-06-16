import { LogoCloud, type Logo } from "@/components/ui/logo-cloud";

// Retailer logos (sourced from mjqinvestment.com/clientel).
const M = "https://static.wixstatic.com/media/";
const RETAILERS: Logo[] = [
  { alt: "Amazon", src: `${M}f079c7_e8106d60572148d0ba78bf809a7f399c~mv2.png` },
  { alt: "Careem", src: `${M}f079c7_40390442164a49b4902184de80ec73ef~mv2.png` },
  { alt: "Noon Minutes", src: `${M}f079c7_6341f741106d48b9857edabf1d63ccb0~mv2.png` },
  { alt: "Gold Apple", src: `${M}f079c7_cbb9c6bc12c1455c95d4a1fe71ca500d~mv2.png`, className: "h-16 max-w-[150px] md:h-24 md:max-w-[170px]" },
  { alt: "Carrefour", src: `${M}f079c7_0f73fa18d4c841d2ab4bb60c04ef80a3~mv2.png`, className: "h-16 max-w-[180px] md:h-24 md:max-w-[200px]" },
  { alt: "Grandiose", src: "/retailers/grandiose.png", className: "h-12 max-w-[185px] md:h-16 md:max-w-[210px]" },
  { alt: "Spinneys", src: `${M}f079c7_594718b2fc9a4315b6ebe4a091bcd999~mv2.png`, className: "h-16 max-w-[150px] md:h-[5.5rem] md:max-w-[170px]" },
  { alt: "Union Coop", src: `${M}f079c7_fc781a36bc6d4edb8ef5bb9aa3c7e443~mv2.png` },
];

/** "Fino Premium Touch Available at" — client/retailer logo grid above the footer. */
export function AvailableAt() {
  return (
    <section id="available" className="flex min-h-[100svh] flex-col justify-center py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-12">
        <h2 className="mb-8 text-center text-2xl font-medium tracking-tight text-muted-foreground md:mb-10 md:text-3xl">
          Fino Premium Touch{" "}
          <span className="font-bold text-primary">Available</span> at.
        </h2>
        <LogoCloud logos={RETAILERS} className="mx-auto max-w-5xl" />
      </div>
    </section>
  );
}
