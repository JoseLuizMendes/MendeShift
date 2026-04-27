import * as React from "react";

import { cn } from "@/lib/utils";

export const Section = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"section">
>(({ className, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={cn("py-16 md:py-24 xl:py-28", className)}
      {...props}
    />
  );
});

Section.displayName = "Section";

export function Eyebrow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.3em] text-accent",
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn(
        "mt-4 font-display text-3xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionLead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-6 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
