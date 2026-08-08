import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Star Border (adaptado do React Bits) — luz que percorre a moldura em loop.
 * CSS puro (server component), tokenizado (accent) e reduced-motion-aware
 * (a animação é desligada em globals.css). Reservado a destaques.
 */
export function StarBorder({
  children,
  className,
  innerClassName,
  color = "var(--accent)",
  speed = "6s",
  thickness = 2,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
  thickness?: number;
}) {
  const vars = {
    "--sb-color": color,
    "--sb-speed": speed,
    padding: `${thickness}px`,
  } as CSSProperties;

  return (
    <div
      className={cn("star-border rounded-[var(--radius)]", className)}
      style={vars}
    >
      <span
        className="star-border__travel star-border__travel--bottom"
        aria-hidden="true"
      />
      <span
        className="star-border__travel star-border__travel--top"
        aria-hidden="true"
      />
      <div
        className={cn(
          "star-border__inner h-full rounded-[calc(var(--radius)-2px)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
