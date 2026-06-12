import Image from "next/image";

/** The shared "distributed by MJQ" contact footer.
 *  Used on the landing page (id="contact" for the dock) and at the
 *  bottom of every blog post. */
export function ContactFooter({ id }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-8 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-border bg-secondary px-8 py-16 text-center">
          <Image
            src="/mjq-logo.avif"
            alt="MJQ"
            width={120}
            height={137}
            className="h-auto w-24"
          />
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tighter md:text-5xl">
            Fino Premium Touch, distributed by MJQ.
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            Interested in stocking the Fino Premium Touch range? Get in touch
            with the MJQ team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+971522885649"
              className="inline-flex items-center rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
            >
              +971 52 288 5649
            </a>
            <a
              href="mailto:mk@mjqinvestment.com"
              className="inline-flex items-center rounded-xl border border-border px-7 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              mk@mjqinvestment.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
