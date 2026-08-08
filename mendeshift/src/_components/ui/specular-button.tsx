"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";

import { useLocale } from "@/i18n/context";
import { localeHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * Specular Button (adaptado do React Bits) — botão glossy cujo brilho
 * especular segue o ponteiro no desktop e responde ao press no toque.
 *
 * O highlight só aparece sob `(hover: hover) and (pointer: fine)` (CSS em
 * globals.css); o handler de ponteiro apenas atualiza as CSS vars (rAF-
 * throttled, compatível com o React Compiler) e é inócuo no touch. Compõe
 * `Link` + `localeHref` para preservar href locale-aware, como o ActionLink.
 */
export function SpecularButton({
  href,
  children,
  className,
  ...props
}: Props) {
  const locale = useLocale();
  const ref = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((clientY - rect.top) / rect.height) * 100}%`);
    });
  };

  return (
    <Link
      ref={ref}
      href={localeHref(href, locale)}
      onPointerMove={handlePointerMove}
      className={cn(
        "specular-btn inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full",
        "border border-foreground/20 bg-foreground/[0.04] px-6 py-3",
        "font-mono text-xs uppercase tracking-widest text-foreground",
        "transition-colors duration-300 hover:border-accent hover:text-accent active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span className="specular-btn__sheen" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center gap-3">
        {children}
      </span>
    </Link>
  );
}
