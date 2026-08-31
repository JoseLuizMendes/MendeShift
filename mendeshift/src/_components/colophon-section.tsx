"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { localeHref } from "@/lib/navigation";
import { prefersReducedMotion } from "@/lib/motion";
import { Button } from "@/_components/ui/button";
import { LogoLoop } from "@/_components/ui/logo-loop";
import { NotchedFrame } from "@/_components/ui/notched-frame";
import { Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { BitmapChevron } from "./bitmap-chevron";
import { ScrambleTextOnHover } from "./scramble-text";

gsap.registerPlugin(ScrollTrigger);

type ContactKey = "email" | "github";

/** Coluna "Páginas" — âncoras reais; labels reaproveitadas do namespace `nav`. */
const pageLinks = [
  { navKey: "profile", href: "#about" },
  { navKey: "services", href: "#services" },
  { navKey: "projects", href: "#work" },
  { navKey: "principles", href: "#principles" },
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

/** Contato direto (topo do painel). */
const contactLinks = [
  { key: "email" as const, href: "mailto:josemendess004@gmail.com", label: "Email" },
  { key: "github" as const, href: "https://github.com/JoseLuizMendes", label: "GitHub" },
] as const;

/**
 * Stack real do projeto (ver `package.json`) — uma fileira monocromática via
 * `currentColor`, no lugar do marquee de patrocinadores do Lando. Itens com
 * `node` são marcas desenhadas; os demais entram como wordmark em mono, que é
 * como a maioria dos logos do Lando aparece.
 */
const stackItems: { name: string; node?: ReactNode }[] = [
  {
    name: "Next.js",
    node: (
      <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8.5 16.5 V7.5 L16 16.5 M15.5 7.5 V13" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </>
    ),
  },
  {
    name: "React",
    node: (
      <>
        <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </g>
      </>
    ),
  },
  {
    name: "Tailwind CSS",
    node: (
      <path
        fill="currentColor"
        d="M12 6c-2.7 0-4.38 1.35-5.05 4.05.99-1.35 2.16-1.86 3.51-1.53.77.19 1.32.75 1.94 1.37 1 1.01 2.16 2.16 4.66 2.16 2.7 0 4.38-1.35 5.05-4.05-.99 1.35-2.16 1.86-3.51 1.53-.77-.19-1.32-.75-1.94-1.37C15.66 7.15 14.5 6 12 6zM6.95 12c-2.7 0-4.38 1.35-5.05 4.05.99-1.35 2.16-1.86 3.51-1.53.77.19 1.32.75 1.94 1.37 1 1.01 2.16 2.16 4.66 2.16 2.7 0 4.38-1.35 5.05-4.05-.99 1.35-2.16 1.86-3.51 1.53-.77-.19-1.32-.75-1.94-1.37C10.61 13.15 9.45 12 6.95 12z"
      />
    ),
  },
  {
    name: "TypeScript",
    node: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <text
          x="12"
          y="16.5"
          fontSize="9"
          fontFamily="var(--font-mono), monospace"
          fontWeight="700"
          textAnchor="middle"
          fill="currentColor"
        >
          TS
        </text>
      </>
    ),
  },
  {
    name: "Vercel",
    node: <path d="M12 3.5 22 20.5 H2 Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />,
  },
  { name: "GSAP" },
  { name: "Lenis" },
  { name: "MDX" },
  { name: "Zod" },
  { name: "Resend" },
];

export function ColophonSection() {
  const t = useTranslations("colophon");
  const tNav = useTranslations("nav");
  const locale = useLocale();
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
      const blocks = [headerRef.current, anchorRef.current, footerRef.current].filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (!blocks.length) return;

      // O gatilho é a SEÇÃO, não cada bloco: a seção ocupa 100svh e é a última
      // da página, então o rodapé legal (colado na base) nunca cruzaria um
      // `start` medido nele mesmo — ficava preso em `opacity: 0`.
      gsap.from(blocks, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const columnLink =
    "block font-display text-2xl uppercase leading-tight tracking-tight text-foreground/85 transition-colors duration-300 hover:text-accent sm:text-[1.75rem]";

  return (
    <Section id="colophon" className="relative pb-12 pt-6 md:pb-12 md:pt-6 xl:pb-12 xl:pt-6" ref={sectionRef}>
      {/* Full-bleed: cola no SideNav (64px) à esquerda e na borda à direita,
          com a mesma folga fina dos dois lados — como no footer do Lando. */}
      {/* Altura total travada aqui (não no painel): o rodapé legal vive FORA da
          forma, então painel + rodapé precisam dividir a mesma tela. */}
      <div className="px-4 md:flex md:h-[calc(100svh-4.5rem)] md:min-h-[560px] md:flex-col md:pl-[calc(4rem+1.25rem)] md:pr-5">
        {/* Painel com a silhueta do React Bits — uma tela cheia, sem scroll. */}
        <NotchedFrame
          className="md:min-h-0 md:flex-1"
          /* px menor => o conteúdo encosta mais nas laterais da forma; pt maior
             => o topo desce até depois do degrau da aba superior. */
          contentClassName="flex flex-col px-6 pb-10 pt-12 sm:px-8 md:px-10 md:pb-16 md:pt-[3.75rem]"
        >
          {/* Retrato — âncora visual do painel: colado na base e ATRÁS de tudo,
              como o capacete do Lando, cujos ombros somem na borda inferior.
              No mobile volta ao fluxo, logo abaixo do manifesto (order-3). */}
          <div className="pointer-events-none relative z-[1] order-3 mx-auto aspect-4/5 w-full max-w-60 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[40%] lg:aspect-auto lg:max-w-none">
            <Image
              src="/founder.webp"
              alt={t("portrait_alt")}
              fill
              sizes="(max-width: 1024px) 240px, 480px"
              className="portrait-fade object-contain object-bottom"
            />
          </div>

          {/* Topo: título à esquerda, contato direto à direita */}
          <div
            ref={headerRef}
            className="relative z-10 order-1 flex flex-wrap items-start justify-between gap-x-10 gap-y-4"
          >
            <div>
              {/* Todos os breakpoints explícitos: o `SectionTitle` define
                  sm/md/lg e variantes diferentes não se sobrescrevem no twMerge
                  (sem isso o título caía em `text-7xl`). */}
              <SectionTitle className="mt-0 text-2xl sm:text-3xl md:text-3xl lg:text-4xl">
                {t("subtitle")}
              </SectionTitle>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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

          {/* Manifesto — atravessa o painel inteiro, acima do retrato */}
          <div ref={anchorRef} className="relative z-10 order-2 mt-6 text-center lg:mt-4">
            {/* `max-w-[8em]` é relativo ao próprio tamanho da fonte: força as
                duas linhas do manifesto em qualquer breakpoint, como no Lando. */}
            {/* Assinatura acima da frase — o lugar do autógrafo do Lando */}
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              José Luiz Mendes · <span className="text-accent">{t("founder_role")}</span>
            </p>
            <h3 className="mx-auto mt-3 max-w-[8em] font-display text-[clamp(1.9rem,4.2vw,3.5rem)] font-normal uppercase leading-[0.94] tracking-[-0.02em]">
              <span className="text-foreground">{t("manifesto_a")} </span>
              <span className="text-accent">{t("manifesto_b")}</span>
            </h3>
          </div>

          {/* Colunas — ancoradas na base do miolo, flanqueando o retrato */}
          {/* `items-start` alinha os dois rótulos na MESMA linha, como no Lando
              (com `items-end` as listas de tamanhos diferentes desencontravam). */}
          <div className="relative z-10 order-4 mt-6 grid min-h-0 flex-1 gap-8 lg:-mt-20 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-start lg:gap-8 lg:px-[13%]">
            {/* Páginas */}
            <nav className="order-2 lg:order-1 lg:col-start-1" aria-label={t("pages_label")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {t("pages_label")}
              </p>
              <ul className="mt-3 space-y-0.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={localeHref(link.href, locale)} className={columnLink}>
                      {tNav(link.navKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Seguir */}
            <nav className="order-3 lg:col-start-3" aria-label={t("follow_label")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:text-right">
                {t("follow_label")}
              </p>
              <ul className="mt-3 space-y-0.5 lg:text-right">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={columnLink}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Stack — fileira espalhada de ponta a ponta, sobre o retrato
              (o lugar do marquee de patrocinadores do Lando) */}
          {/* Stack em loop infinito (CSS puro, pausa no hover, estática em
              reduced-motion) — o marquee de patrocinadores do Lando. Fica em
              `z-0` para correr POR TRÁS do retrato. */}
          <div className="relative z-0 order-5 mt-6 md:mt-5">
            <LogoLoop
              items={stackItems.map((item) =>
                item.node ? (
                  <svg
                    key={item.name}
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label={item.name}
                    className="logo-loop-item h-6 w-6 text-muted-foreground/55"
                  >
                    {item.node}
                  </svg>
                ) : (
                  <span key={item.name} className="logo-loop-item font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">
                    {item.name}
                  </span>
                ),
              )}
              gap={56}
              durationSec={38}
              label={t("stack_label")}
            />
          </div>

          {/* CTA primário — cruzando a borda inferior, na aba da forma */}
          <div className="absolute left-1/2 top-full z-20 order-7 -translate-x-1/2 -translate-y-1/2">
            <Button href="/contato" variant="primary" size="md">
              {t("cta_project")}
            </Button>
          </div>
        </NotchedFrame>

        {/* Rodapé legal — FORA do painel, subindo para a faixa dos DEGRAUS: a aba
            inferior mergulha no centro (onde fica o CTA) e as laterais da forma
            fecham ~21px mais alto, deixando essa canaleta livre. O `-mt` no md+
            alinha a linha com o centro do botão. Cada lado precisa caber nos
            21,6% de largura antes da curva da aba — daí o tracking curto. */}
        <div
          ref={footerRef}
          className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-2 md:-mt-4 md:pl-4 md:pr-0"
        >
          <p className="font-mono text-[9px] uppercase tracking-normal text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex mx-28 gap-5">
            <Button href="/privacidade" variant="ghost" size="sm" className="text-[9px]">
              {t("privacy")}
            </Button>
            <Button href="/termos" variant="ghost" size="sm" className="text-[9px]">
              {t("terms")}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
