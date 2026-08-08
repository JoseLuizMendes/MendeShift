import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Glare Hover (adaptado do React Bits) — sheen diagonal que varre no hover.
 * CSS puro (server component). Desktop-only por design: o streak só se move
 * sob `(hover: hover) and (pointer: fine)` (ver globals.css); no touch fica
 * fora da tela, invisível. Some sob prefers-reduced-motion.
 */
export function GlareHover({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glare", className)}>
      <span className="glare__streak" aria-hidden="true" />
      {children}
    </div>
  );
}
