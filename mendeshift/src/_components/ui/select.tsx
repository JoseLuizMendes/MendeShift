import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Select nativo estilizado nos tokens do design system.
 * Preferido ao Radix Select no formulário de briefing: zero JS extra,
 * acessível por padrão e com melhor UX no mobile (picker nativo).
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full appearance-none rounded-xl border border-border/50 bg-muted/50 px-4 font-mono text-sm text-foreground",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        "aria-invalid:border-accent/70",
        // chevron via background para manter o appearance-none consistente
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%235a606b%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
