"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";
import { LogoLoop } from "@/_components/ui/logo-loop";
import { NotchedFrame } from "@/_components/ui/notched-frame";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { BitmapChevron } from "./bitmap-chevron";
import { ScrambleTextOnHover } from "./scramble-text";

gsap.registerPlugin(ScrollTrigger);

type ContactKey = "email" | "github";

/** Categorias que passam no marquee (4 fileiras, direção alternada). */
const marqueeRows = [
  { label: "Design", items: ["MendeShift", "Interface Lab"] },
  { label: "Stack", items: ["Next.js", "React 19", "Tailwind CSS", "TypeScript"] },
  { label: "Typography", items: ["Bebas Neue", "IBM Plex Sans", "IBM Plex Mono"] },
  { label: "Mode", items: ["Dark-first", "Token-driven", "Motion-aware"] },
] as const;

/** Coluna "Páginas" — âncoras reais; labels reaproveitadas do namespace `nav`. */
const pageLinks = [
  { navKey: "profile", href: "#about" },
  { navKey: "services", href: "#services" },
  { navKey: "projects", href: "#work" },
  { navKey: "principles", href: "#principles" },
  { navKey: "process", href: "#process" },
  { navKey: "blog", href: "/blog" },
  { navKey: "contact", href: "/contato" },
] as const;

/** Coluna "Seguir" — só redes sociais. TODO: confirmar handles de TikTok/Instagram. */
const socialLinks = [
  { label: "TikTok", href: "https://www.tiktok.com/@mendeshift" },
  { label: "Instagram", href: "https://www.instagram.com/mendeshift" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jos%C3%A9-luiz-dos-santos-azeredo-mendes/",
  },
] as const;

/** Contato direto (topo do painel). LinkedIn migrou para a coluna "Seguir". */
const contactLinks = [
  { key: "email" as const, href: "mailto:josemendess004@gmail.com", label: "Email" },
  { key: "github" as const, href: "https://github.com/JoseLuizMendes", label: "GitHub" },
] as const;

/** Monta os nós de uma fileira do marquee, repetidos para preencher a largura. */
function buildRowItems(items: readonly string[], reps = 6): ReactNode[] {
  const nodes: ReactNode[] = [];
  for (let r = 0; r < reps; r++) {
    for (const item of items) {
      nodes.push(
        <span
          key={`${r}-${item}`}
          className="logo-loop-item font-display text-2xl tracking-tight text-foreground/55 sm:text-3xl"
        >
          {item}
        </span>,
      );
    }
  }
  return nodes;
}

export function ColophonSection({ topHref = "#hero" }: { topHref?: string }) {
  const t = useTranslations("colophon");
  const tNav = useTranslations("nav");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrambleTokens, setScrambleTokens] = useState<Record<ContactKey, number>>({
    email: 0,
    github: 0,
  });

  const triggerScramble = (key: ContactKey) => {
    setScrambleTokens((current) => ({ ...current, [key]: current[key] + 1 }));
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      for (const el of [headerRef.current, anchorRef.current, footerRef.current]) {
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
      <Container>
        {/* Painel emoldurado (moldura entalhada + blueprint + borda coral) */}
        <NotchedFrame
          className="px-5 pb-24 pt-8 sm:px-8 sm:pb-28 md:px-14 md:pb-28 md:pt-12 lg:px-20"
          radius={40}
        >
          {/* Topo: marca do estúdio + contato direto */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span className="font-display text-xl uppercase tracking-tight text-foreground sm:text-2xl">
              MendeShift
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {contactLinks.map((link) => (
                <Button
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
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

          {/* Header da seção */}
          <div ref={headerRef} className="mt-10 max-w-2xl md:mt-12">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle className="text-3xl sm:text-4xl md:text-5xl">{t("title")}</SectionTitle>
            <SectionLead>{t("lead")}</SectionLead>
          </div>

          {/* Âncora central + colunas laterais */}
          <div
            ref={anchorRef}
            className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_minmax(0,9rem)] lg:items-center lg:gap-10"
          >
            {/* Coluna: Páginas */}
            <nav className="order-2 lg:order-1" aria-label={t("pages_label")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {t("pages_label")}
              </p>
              <ul className="mt-4 space-y-1.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Button
                      href={link.href}
                      variant="ghost"
                      size="sm"
                      className="px-0 text-[11px] tracking-[0.18em] text-foreground/80 hover:text-accent"
                    >
                      {tNav(link.navKey)}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Centro: manifesto + retrato + caption */}
            <div className="order-1 flex flex-col items-center text-center lg:order-2">
              <h3 className="relative z-10 max-w-xl font-display text-[clamp(2.25rem,6vw,4rem)] font-normal uppercase leading-[0.92] tracking-[-0.02em]">
                <span className="text-foreground">{t("manifesto_a")} </span>
                <span className="text-accent">{t("manifesto_b")}</span>
              </h3>

              <div className="relative z-0 -mt-4 aspect-[4/5] w-full max-w-[280px] sm:max-w-[320px] md:-mt-6">
                <Image
                  src="/founder.webp"
                  alt={t("portrait_alt")}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="portrait-fade object-cover object-top"
                />
              </div>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                José Luiz Mendes · <span className="text-accent">{t("founder_role")}</span>
              </p>
            </div>

            {/* Coluna: Seguir */}
            <nav className="order-3" aria-label={t("follow_label")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:text-right">
                {t("follow_label")}
              </p>
              <ul className="mt-4 space-y-1.5 lg:text-right">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <Button
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="ghost"
                      size="sm"
                      className="px-0 text-[11px] tracking-[0.18em] text-foreground/80 hover:text-accent"
                    >
                      {link.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* CTA primário encaixado no notch inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <Button href="/contato" variant="primary" size="md">
              {t("cta_project")}
            </Button>
          </div>
        </NotchedFrame>

        {/* Marquee de stack — 4 fileiras alternando direção. */}
        <div className="mt-16 flex flex-col gap-2.5 border-y border-border/15 py-8 md:mt-20 md:gap-3.5 md:py-10">
          {marqueeRows.map((row, i) => (
            <LogoLoop
              key={row.label}
              items={buildRowItems(row.items)}
              direction={i % 2 === 0 ? "left" : "right"}
              durationSec={40 + i * 4}
            />
          ))}
        </div>

        {/* Rodapé legal — linha simples com border-t. */}
        <div
          ref={footerRef}
          className="mt-10 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <span className="hidden text-muted-foreground/40 sm:inline">•</span>
            <div className="flex items-center gap-4">
              <Button href="/privacidade" variant="ghost" size="sm" className="text-[10px]">
                {t("privacy")}
              </Button>
              <Button href="/termos" variant="ghost" size="sm" className="text-[10px]">
                {t("terms")}
              </Button>
            </div>
          </div>

          <Button href={topHref} variant="ghost" size="sm">
            {t("back_to_top")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
