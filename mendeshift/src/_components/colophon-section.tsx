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
        const columns = gridRef.current.querySelectorAll(":scope > div");
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
        <div ref={headerRef} className="mb-12">
          <Eyebrow>04 / Colophon</Eyebrow>
          <SectionTitle>Contato e créditos</SectionTitle>
          <SectionLead>
            Design system orientado a tokens, implementação em Next.js e
            composição de componentes estilo Shadcn.
          </SectionLead>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 justify-between lg:grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content]"
        >
          <MetaColumn title="Design" items={["MendeShift", "Interface Lab"]} />
          <MetaColumn
            title="Stack"
            items={["Next.js", "Tailwind CSS", "TypeScript"]}
          />
          <MetaColumn
            title="Tipografia"
            items={["Bebas Neue", "IBM Plex Sans", "IBM Plex Mono"]}
          />
          <MetaColumn title="Modo" items={["Dark-first", "Token-driven"]} />
          <div className="flex flex-col items-center">
            <h4 className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Contato
            </h4>
            <ul className="space-y-2 text-center">
              <li>
                <ActionLink
                  href="mailto:josemendess004@gmail.com"
                  className="group w-fit px-4 py-2 text-[10px] hover:text-accent"
                  onMouseEnter={() => triggerScramble("email")}
                  onFocus={() => triggerScramble("email")}
                  variant="ghost"
                >
                  <ScrambleTextOnHover
                    text="email"
                    as="span"
                    duration={0.55}
                    className="text-[10px] transition-colors duration-300 group-hover:text-accent"
                    triggerToken={scrambleTokens.email}
                  />
                  <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000 group-hover:text-accent" />
                </ActionLink>
              </li>
              <li>
                <ActionLink
                  href="https://github.com/JoseLuizMendes"
                  className="group w-fit px-4 py-2 text-[10px] hover:text-accent"
                  onMouseEnter={() => triggerScramble("github")}
                  onFocus={() => triggerScramble("github")}
                  variant="ghost"
                >
                  <ScrambleTextOnHover
                    text="github"
                    as="span"
                    duration={0.55}
                    className="text-[10px] transition-colors duration-300 group-hover:text-accent"
                    triggerToken={scrambleTokens.github}
                  />
                  <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000 group-hover:text-accent" />
                </ActionLink>
              </li>
              <li>
                <ActionLink
                  href="https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/"
                  className="group w-fit px-4 py-2 text-[10px] hover:text-accent"
                  onMouseEnter={() => triggerScramble("linkedin")}
                  onFocus={() => triggerScramble("linkedin")}
                  variant="ghost"
                >
                  <ScrambleTextOnHover
                    text="linkedin"
                    as="span"
                    duration={0.55}
                    className="text-[10px] transition-colors duration-300 group-hover:text-accent"
                    triggerToken={scrambleTokens.linkedin}
                  />
                  <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000 group-hover:text-accent" />
                </ActionLink>
              </li>
            </ul>
          </div>
          <MetaColumn
            title="Ano"
            items={[String(new Date().getFullYear()), "Ongoing"]}
          />
        </div>

        <Card
          ref={footerRef}
          className="mt-16 border-border/40 bg-card/70 p-8 md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} MendeShift. All rights reserved.
            </p>
            <ActionLink href={topHref} variant="ghost">
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
    <div>
      <h4 className="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="font-mono text-xs text-foreground/80">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
