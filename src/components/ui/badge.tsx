import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase transition-colors",
        variant === "outline"
          ? "border-border text-foreground/70"
          : "border-transparent bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
