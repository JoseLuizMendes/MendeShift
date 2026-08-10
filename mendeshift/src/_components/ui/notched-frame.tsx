"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

type Notch = { width: number; depth: number };

/**
 * Monta o contorno do painel: retângulo de cantos arredondados com um
 * entalhe côncavo (notch) centralizado na borda inferior — onde encaixa o CTA.
 * Traçado no sentido horário; ombros do notch com filete `f`, fundo do
 * notch com raio `ic`.
 */
function buildPanelPath(w: number, h: number, r: number, notch: Notch): string {
  const cx = w / 2;
  const nd = Math.min(notch.depth, h / 2);
  const nw = Math.min(notch.width, w - 2 * r - 8);
  const f = Math.min(22, nd - 2, nw / 2 - 2);
  const ic = Math.max(2, Math.min(16, nw / 2 - f - 2));
  const nLeft = cx - nw / 2;
  const nRight = cx + nw / 2;

  return [
    `M ${r},0`,
    `H ${w - r}`,
    `A ${r},${r} 0 0 1 ${w},${r}`,
    `V ${h - r}`,
    `A ${r},${r} 0 0 1 ${w - r},${h}`,
    `H ${nRight + f}`,
    `A ${f},${f} 0 0 0 ${nRight},${h - f}`, // ombro direito (côncavo)
    `V ${h - nd + ic}`,
    `A ${ic},${ic} 0 0 1 ${nRight - ic},${h - nd}`, // canto interno direito
    `H ${nLeft + ic}`,
    `A ${ic},${ic} 0 0 1 ${nLeft},${h - nd + ic}`, // canto interno esquerdo
    `V ${h - f}`,
    `A ${f},${f} 0 0 0 ${nLeft - f},${h}`, // ombro esquerdo (côncavo)
    `H ${r}`,
    `A ${r},${r} 0 0 1 0,${h - r}`,
    `V ${r}`,
    `A ${r},${r} 0 0 1 ${r},0`,
    "Z",
  ].join(" ");
}

type NotchedFrameProps = {
  children: ReactNode;
  /** Classes do wrapper de conteúdo (padding etc.). */
  className?: string;
  radius?: number;
  notchWidth?: number;
  notchDepth?: number;
};

/**
 * Painel "não 100% quadrado": cantos arredondados grandes + entalhe inferior
 * (cradle do CTA) + borda coral que se desenha ao entrar na viewport, com uma
 * textura de blueprint sutil ao fundo. Decorativo (`aria-hidden`); o contorno é
 * um SVG medido em pixels reais (ResizeObserver) para ficar nítido em qualquer
 * tamanho. Sem dependência nova.
 */
export function NotchedFrame({
  children,
  className,
  radius = 44,
  notchWidth = 240,
  notchDepth = 46,
}: NotchedFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const uid = useId().replace(/[:]/g, "");
  const clipId = `nf-clip-${uid}`;
  const gridId = `nf-grid-${uid}`;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ w: Math.round(cr.width), h: Math.round(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const ready = w > 1 && h > 1;
  const r = ready ? Math.min(radius, w / 2, h / 2) : radius;
  const path = ready ? buildPanelPath(w, h, r, { width: notchWidth, depth: notchDepth }) : "";

  // Desenho da borda (stroke-dashoffset) ao entrar na viewport.
  useEffect(() => {
    const p = strokeRef.current;
    if (!p || !path) return;
    const len = p.getTotalLength();
    p.style.setProperty("--dash", `${len}`);
    if (prefersReducedMotion()) {
      p.classList.add("is-drawn");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            p.classList.add("is-drawn");
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(p);
    return () => io.disconnect();
  }, [path]);

  return (
    <div ref={rootRef} className="relative">
      {ready && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={path} />
            </clipPath>
            <pattern id={gridId} width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M 46 0 L 0 0 0 46" fill="none" stroke="var(--foreground)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Fill do painel */}
          <path d={path} fill="var(--background)" />

          {/* Blueprint + quadrados accent (recortados pelo contorno) */}
          <g clipPath={`url(#${clipId})`}>
            <rect width={w} height={h} fill={`url(#${gridId})`} opacity="0.06" />
            <g fill="var(--accent)" opacity="0.1">
              <rect x={w - 138} y={94} width={46} height={46} />
              <rect x={46} y={Math.round(h * 0.5)} width={46} height={46} />
            </g>
          </g>

          {/* Borda coral que se desenha */}
          <path
            ref={strokeRef}
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="notch-frame__stroke"
          />
        </svg>
      )}

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}
