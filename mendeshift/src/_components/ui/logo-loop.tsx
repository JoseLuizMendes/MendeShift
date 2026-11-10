import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * LogoLoop (inspirado no React Bits) — marquee horizontal de itens.
 *
 * CSS puro (server component): dois conjuntos idênticos + `translateX(-50%)`
 * em loop, transform na GPU, sem rAF/JS. Pausa no hover, desliga em
 * reduced-motion (globals.css). A segunda cópia é `aria-hidden` para não
 * duplicar conteúdo no leitor de tela. Zero dependência nova.
 */
export function LogoLoop({
  items,
  direction = "left",
  durationSec = 32,
  gap = 44,
  fadeOut = true,
  label,
  className,
}: {
  items: ReactNode[];
  direction?: "left" | "right";
  durationSec?: number;
  gap?: number;
  fadeOut?: boolean;
  label?: string;
  className?: string;
}) {
  const style = {
    "--logo-loop-duration": `${durationSec}s`,
    gap: `${gap}px`,
  } as CSSProperties;

  const renderSet = (hidden: boolean) => (
    <ul
      className="logo-loop-set"
      style={{ gap: `${gap}px` }}
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <li key={i} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("logo-loop", fadeOut && "logo-loop--fade", className)}
      aria-label={label}
    >
      <div
        className={cn(
          "logo-loop-track",
          direction === "left" ? "logo-loop-track--left" : "logo-loop-track--right",
        )}
        style={style}
      >
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
}
