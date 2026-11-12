import * as React from "react";

import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "portfolio-select h-12 w-full cursor-pointer appearance-none border border-border/50 bg-muted/50 px-4 font-mono text-base text-foreground transition-colors interaction-motion hover:border-accent/50 sm:text-sm",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 aria-invalid:border-accent/70 disabled:cursor-default disabled:opacity-50",
        // chevron via background para manter o appearance-none consistente
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%23ff4d4f%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
