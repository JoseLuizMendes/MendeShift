import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"label">) {
  return (
    <label
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
