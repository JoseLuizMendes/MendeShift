import * as React from "react";

import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[var(--radius)] border border-border/50 bg-card",
        className,
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";
