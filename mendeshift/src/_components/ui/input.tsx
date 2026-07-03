import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-border/50 bg-muted/50 px-4 font-mono text-sm text-foreground",
        "placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        "aria-invalid:border-accent/70",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
