"use client";

import { useState } from "react";
import Image from "next/image";
import { Code2, Layers, BadgeCheck } from "lucide-react";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { BitmapChevron } from "@/_components/bitmap-chevron";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/jos%C3%A9-luiz-dos-santos-azeredo-mendes/";

export function ProfileCard() {
  const [scrambleToken, setScrambleToken] = useState(0);

  return (
    <div className="group relative h-115 w-full overflow-hidden rounded-3xl border border-border/40">
      {/* Photo */}
      <Image
        src="/card_profile.webp"
        alt="José Luiz Mendes — Product Engineer"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 100vw"
        className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.01]"
      />

      {/* Base gradient — dark bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-background/75 via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-transparent" />

      {/* Glass layer — fades in from bottom up to name height */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] backdrop-blur-[2px]"
        style={{
          maskImage: "linear-gradient(to top, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 10%, transparent 100%)",
        }}
      />

      {/* Top — location pill */}
      <div className="absolute left-4 top-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/30 bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/80 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500/80" />
          Online
        </span>
      </div>

      {/* Bottom — identity + stats + cta */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16">

        {/* Name + badge */}
        <div className="flex items-center gap-2">
          <p className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
            José Luiz Mendes
          </p>
          <BadgeCheck
            className="mb-0.5 h-6 w-6 shrink-0 text-accent"
            strokeWidth={1.5}
            aria-label="Verificado"
          />
        </div>

        {/* Role */}
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/75">
          Product Engineer · Freelancer
        </p>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 border-t border-border/20 pt-4">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
              5+ projetos
            </span>
          </div>
          <div className="h-3 w-px bg-border/30" />
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
              Full Stack
            </span>
          </div>
        </div>

        {/* Connect button */}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setScrambleToken((t) => t + 1)}
          className="group/btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent transition-all duration-300 hover:border-accent/70 hover:bg-accent/20"
        >
          <ScrambleTextOnHover
            text="Connect"
            as="span"
            duration={0.45}
            triggerToken={scrambleToken}
            className="transition-colors duration-300"
          />
          <BitmapChevron className="w-2.5 transition-transform duration-500 group-hover/btn:rotate-90" />
        </a>
      </div>
    </div>
  );
}
