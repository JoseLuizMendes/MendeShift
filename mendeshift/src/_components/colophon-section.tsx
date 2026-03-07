"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import {
  Eyebrow,
  Section,
  SectionLead,
  SectionTitle,
} from "@/_components/ui/section";
import { BitmapChevron } from "./bitmap-chevron";
import { ScrambleTextOnHover } from "./scramble-text";

gsap.registerPlugin(ScrollTrigger);

type ContactKey = "email" | "github" | "linkedin";

const metaGroups = [
  {
    title: "Design",
    items: ["MendeShift", "Interface Lab"],
  },
  {
    title: "Stack",
    items: ["Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Tipografia",
    items: ["Bebas Neue", "IBM Plex Sans", "IBM Plex Mono"],
  },
  {
    title: "Modo",
    items: ["Dark-first", "Token-driven"],
  },
  {
    title: "Ano",
    items: [String(new Date().getFullYear()), "Ongoing"],
  },
] as const;

const contactLinks = [
  {
    key: "email" as const,
    href: "mailto:josemendess004@gmail.com",
    label: "Email",
  },
  {
    key: "github" as const,
    href: "https://github.com/JoseLuizMendes",
    label: "GitHub",
  },
  {
    key: "linkedin" as const,
    href: "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
    label: "LinkedIn",
  },
] as const;

export function ColophonSection({ topHref = "#hero" }: { topHref?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrambleTokens, setScrambleTokens] = useState<Record<ContactKey, number>>({
    email: 0,
    github: 0,
    linkedin: 0,
  });

  const triggerScramble = (key: ContactKey) => {
    setScrambleTokens((current) => ({
      ...current,
      [key]: current[key] + 1,
    }));
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > *");
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      id="colophon"
      className="relative border-t border-border/20"
      ref={sectionRef}
    >
      <Container className="md:px-30">
        <div
          ref={headerRef}
          className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-end lg:gap-10"
        >
          <div>
            <Eyebrow>06 / Colophon</Eyebrow>
            <SectionTitle>Créditos</SectionTitle>
          </div>
          <SectionLead className="mt-0 max-w-2xl text-left lg:justify-self-end lg:text-right">
            Sistema visual, stack e decisões-base que sustentam a interface.
            No mobile, a leitura agora prioriza blocos curtos e ações diretas.
          </SectionLead>
        </div>

        <div
          ref={gridRef}
          className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
        >
          <Card className="border-border/40 bg-card/55 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-6 border-b border-border/30 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  Build Notes
                </p>
                <p className="mt-3 max-w-lg font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Um colophon mais editorial, com blocos agrupados por função.
                  Isso reduz altura no mobile e melhora escaneabilidade sem perder densidade.
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:text-right">
                05 grupos
                <br />
                01 sistema
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {metaGroups.map((group) => (
                <MetaColumn key={group.title} title={group.title} items={[...group.items]} />
              ))}
            </div>
          </Card>

          <Card className="border-border/40 bg-card/70 p-5 sm:p-6">
            <div className="flex h-full flex-col">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  Contato
                </p>
                <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  Canais diretos para conversa, proposta ou continuidade de projeto.
                </p>
              </div>

              <div className="mt-6 flex flex-1 flex-col gap-2.5">
                {contactLinks.map((link) => (
                  <ActionLink
                    key={link.key}
                    href={link.href}
                    className="group h-12 w-full justify-between rounded-full border border-border/50 bg-background/20 px-4 text-[10px] tracking-[0.24em] text-foreground transition-all duration-300 hover:border-accent/70 hover:bg-accent/5 hover:text-accent"
                    onMouseEnter={() => triggerScramble(link.key)}
                    onFocus={() => triggerScramble(link.key)}
                    variant="ghost"
                  >
                    <ScrambleTextOnHover
                      text={link.label}
                      as="span"
                      duration={0.55}
                      className="text-[10px] transition-colors duration-300"
                      triggerToken={scrambleTokens[link.key]}
                    />
                    <BitmapChevron className="w-3.5 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
                  </ActionLink>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card
          ref={footerRef}
          className="mt-16 border-border/40 bg-card/70 p-6 md:p-10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} MendeShift. All rights reserved.
            </p>
            <ActionLink href={topHref} variant="ghost" className="self-start md:self-auto">
              Voltar ao topo
            </ActionLink>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

function MetaColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/25 bg-background/15 p-4 sm:p-5">
      <h4 className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="font-mono text-xs leading-relaxed text-foreground/80 sm:text-[13px]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
