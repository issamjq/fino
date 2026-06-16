import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Logo = {
  /** logo image URL; when omitted a neutral placeholder bar is shown */
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  /** per-logo size override (e.g. bump logos with lots of internal padding) */
  className?: string;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  /** the retailers/clients to show (up to 8 fill the decorated grid) */
  logos?: Logo[];
};

// Placeholder slots until the real client logos are supplied.
const PLACEHOLDERS: Logo[] = Array.from({ length: 8 }, (_, i) => ({
  alt: `Retailer ${i + 1}`,
}));

export function LogoCloud({ className, logos = PLACEHOLDERS, ...props }: LogoCloudProps) {
  const l = (i: number): Logo => logos[i] ?? { alt: `Retailer ${i + 1}` };

  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x md:grid-cols-4",
        className
      )}
      {...props}
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

      <LogoCard className="relative border-r border-b bg-secondary" logo={l(0)}>
        <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-border" strokeWidth={1} />
      </LogoCard>

      <LogoCard className="border-b md:border-r" logo={l(1)} />

      <LogoCard className="relative border-r border-b md:bg-secondary" logo={l(2)}>
        <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-border" strokeWidth={1} />
        <PlusIcon className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 text-border md:block" strokeWidth={1} />
      </LogoCard>

      <LogoCard className="relative border-b bg-secondary md:bg-background" logo={l(3)} />

      <LogoCard className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background" logo={l(4)}>
        <PlusIcon className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 text-border md:hidden" strokeWidth={1} />
      </LogoCard>

      <LogoCard className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary" logo={l(5)} />

      <LogoCard className="border-r" logo={l(6)} />

      <LogoCard className="bg-secondary" logo={l(7)} />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background px-3 py-6 md:p-6",
        className
      )}
      {...props}
    >
      {logo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={logo.alt}
          className={cn(
            "pointer-events-none h-11 w-auto max-w-[150px] select-none object-contain md:h-16 md:max-w-[185px]",
            logo.className
          )}
          height={logo.height || "auto"}
          src={logo.src}
          width={logo.width || "auto"}
        />
      ) : (
        <div className="h-4 w-20 rounded bg-muted md:h-5 md:w-24" aria-hidden />
      )}
      {children}
    </div>
  );
}
