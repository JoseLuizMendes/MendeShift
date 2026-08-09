"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";
import { LogoLoop } from "@/_components/ui/logo-loop";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { BitmapChevron } from "./bitmap-chevron";
import { ScrambleTextOnHover } from "./scramble-text";

gsap.registerPlugin(ScrollTrigger);

type ContactKey = "email" | "github" | "linkedin";

/** Categorias que passam no marquee (4 fileiras, direção alternada). */
const marqueeRows = [
  { label: "Design", items: ["MendeShift", "Interface Lab"] },
  { label: "Stack", items: ["Next.js", "React 19", "Tailwind CSS", "TypeScript"] },
  { label: "Typography", items: ["Bebas Neue", "IBM Plex Sans", "IBM Plex Mono"] },
  { label: "Mode", items: ["Dark-first", "Token-driven", "Motion-aware"] },
] as const;

const contactLinks = [
  { key: "email" as const, href: "mailto:josemendess004@gmail.com", label: "Email" },
  { key: "github" as const, href: "https://github.com/JoseLuizMendes", label: "GitHub" },
  {
    key: "linkedin" as const,
    href: "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
    label: "LinkedIn",
  },
] as const;

/** Monta os nós de uma fileira do marquee, repetidos para preencher a largura. */
function buildRowItems(items: readonly string[], reps = 6): ReactNode[] {
  const nodes: ReactNode[] = [];
  for (let r = 0; r < reps; r++) {
    for (const item of items) {
      nodes.push(
        <span className="logo-loop-item font-display text-2xl tracking-tight text-foreground/55 sm:text-3xl">
          {item}
        </span>,
      );
    }
  }
  return nodes;
}

export function ColophonSection({ topHref = "#hero" }: { topHref?: string }) {
  const t = useTranslations("colophon");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrambleTokens, setScrambleTokens] = useState<Record<ContactKey, number>>({
    email: 0,
    github: 0,
    linkedin: 0,
  });

  const triggerScramble = (key: ContactKey) => {
    setScrambleTokens((current) => ({ ...current, [key]: current[key] + 1 }));
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      for (const el of [headerRef.current, footerRef.current]) {
        if (!el) continue;
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="colophon" className="relative border-t border-border/20" ref={sectionRef}>
      <Container className="md:px-30">
        <div
          ref={headerRef}
          className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-end lg:gap-10"
        >
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
          </div>
          <SectionLead className="mt-0 max-w-2xl text-left lg:justify-self-end lg:text-right">
            {t("lead")}
          </SectionLead>
        </div>
      </Container>

      {/* Marquee full-bleed — 4 fileiras alternando direção. */}
      <div className="mt-10 flex flex-col gap-2.5 border-y border-border/15 py-8 md:mt-14 md:gap-3.5 md:py-10">
        {marqueeRows.map((row, i) => (
          <LogoLoop
            key={row.label}
            items={buildRowItems(row.items)}
            direction={i % 2 === 0 ? "left" : "right"}
            durationSec={40 + i * 4}
          />
        ))}
      </div>

      <Container className="md:px-30">
        {/* Contato — linha slim, sem card. */}
        <div className="mt-12 flex flex-col gap-5 md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {t("contact_label")}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {contactLinks.map((link) => (
              <Button
                key={link.key}
                href={link.href}
                variant="ghost"
                size="sm"
                className="tracking-[0.24em]"
                onMouseEnter={() => triggerScramble(link.key)}
                onFocus={() => triggerScramble(link.key)}
              >
                <ScrambleTextOnHover
                  text={link.label}
                  as="span"
                  duration={0.55}
                  className="text-[11px]"
                  triggerToken={scrambleTokens[link.key]}
                />
                <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover/btn:rotate-45 group-hover/btn:duration-1000" />
              </Button>
            ))}
          </div>
        </div>

        {/* Rodapé — linha simples, sem card. */}
        <div
          ref={footerRef}
          className="mt-14 flex flex-col gap-4 border-t border-border/20 pt-8 md:flex-row md:items-center md:justify-between"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <Button href={topHref} variant="ghost" size="sm">
            {t("back_to_top")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
