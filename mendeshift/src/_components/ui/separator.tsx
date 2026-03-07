import * as React from "react";

import { cn } from "@/lib/utils";

type SeparatorProps = React.ComponentPropsWithoutRef<"div">;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "h-px w-full bg-linear-to-r from-accent  via-border/40 to-accent",
        className,
      )}
      {...props}
    />
  );
}
