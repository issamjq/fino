import Image from "next/image";
import { MapPin } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";

/** The shared "distributed by MJQ" contact section.
 *  Used on the landing page (id="contact" for the dock) and at the
 *  bottom of every blog post. Left: MJQ info + direct contact. Right: form. */
export function ContactFooter({ id }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-8 py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 items-stretch gap-8 rounded-2xl border border-border bg-secondary p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: MJQ info + direct contact */}
          <div className="flex flex-col items-start justify-center gap-6 text-left">
            <Image
              src="/mjq-logo.avif"
              alt="MJQ"
              width={120}
              height={137}
              className="h-auto w-20"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                Fino Premium Touch, distributed by MJQ.
              </h2>
              <p className="max-w-md text-lg text-muted-foreground">
                Interested in stocking the Fino Premium Touch range? Send us a
                message or reach the MJQ team directly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+971522885649"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              >
                +971 52 288 5649
              </a>
              <a
                href="mailto:mk@mjqinvestment.com"
                className="inline-flex items-center rounded-xl border border-border bg-background px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
              >
                mk@mjqinvestment.com
              </a>
            </div>
            <a
              href="https://maps.google.com/?q=Opal+Tower+Marasi+Drive+Business+Bay+Dubai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                MJQ Investment LLC, Office&nbsp;#607, Opal Tower — Marasi Dr,
                <br />
                Business Bay, Dubai
              </span>
            </a>
          </div>

          {/* Right: contact form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
