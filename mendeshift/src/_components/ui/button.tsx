"use client";

import type { FocusEventHandler, MouseEventHandler, ReactNode } from "react";
import Link from "next/link";

import { useLocale } from "@/i18n/context";
import { localeHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  /** Com `href` renderiza um Link (locale-aware); sem `href`, um <button>. */
  href?: string;
  variant?: Variant;
  size?: Size;
  /** Brilho especular que segue o ponteiro (desktop) + press. Default: só no primary. */
  specular?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
  // pass-through comuns (anchor + button)
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  "aria-label"?: string;
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full font-mono uppercase tracking-widest transition-colors duration-300 ease-emphasis active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "text-[10px] px-4 py-2",
  md: "text-xs px-6 py-3",
  lg: "text-sm px-8 py-3.5",
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  secondary: "border border-foreground/20 text-foreground hover:border-accent hover:text-accent",
  ghost: "px-1 text-muted-foreground hover:text-foreground",
};

/**
 * Botão canônico do MendeShift. Substitui o antigo ActionLink e o
 * SpecularButton. Polimórfico (Link/button), tokenizado, reduced-motion-aware
 * (o sheen é desligado por CSS). O brilho especular vem embutido no `primary`
 * e pode ser ligado em qualquer variante via `specular`.
 */
export function Button({
  href,
  variant = "secondary",
  size = "md",
  specular,
  fullWidth,
  className,
  children,
  target,
  rel,
  type,
  disabled,
  onClick,
  onMouseEnter,
  onFocus,
  ...aria
}: ButtonProps) {
  const locale = useLocale();
  const withSheen = specular ?? variant === "primary";

  const classes = cn(
    base,
    sizes[size],
    variants[variant],
    withSheen && "specular-btn",
    fullWidth && "w-full",
    className,
  );

  // Atualiza a posição do brilho (só custa algo enquanto o ponteiro está sobre
  // o botão, em dispositivos com hover; no touch o sheen fica invisível via CSS).
  const handlePointerMove = withSheen
    ? (event: React.PointerEvent<HTMLElement>) => {
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }
    : undefined;

  const inner = (
    <>
      {withSheen && <span className="specular-btn__sheen" aria-hidden="true" />}
      <span className="relative z-10 inline-flex items-center justify-center gap-3">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={localeHref(href, locale)}
        className={classes}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onPointerMove={handlePointerMove}
        {...aria}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type ?? "button"}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onPointerMove={handlePointerMove}
      {...aria}
    >
      {inner}
    </button>
  );
}
