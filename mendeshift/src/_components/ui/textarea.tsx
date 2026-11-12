import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full resize-y border border-border/50 bg-muted/50 px-4 py-3 font-mono text-base text-foreground sm:text-sm",
        "placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        "aria-invalid:border-accent/70",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
