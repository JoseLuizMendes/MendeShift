"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HighlightText } from "@/_components/highlight-text";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    number: "01",
    title: "End-to-End Ownership",
    description:
      "Do banco à interface, responsabilidade total pelo produto. Nenhuma camada é problema de outro.",
    signal: "Produto inteiro no radar, sem repasse silencioso de responsabilidade.",
    tags: ["arquitetura", "backend", "frontend", "deploy"],
    align: "left",
  },
  {
    number: "02",
    title: "Engineering for Impact",
    description:
      "Código sem impacto é exercício. Cada solução precisa resolver uma dor real do produto.",
    signal: "Decisão técnica só se sustenta quando encurta risco ou aumenta resultado.",
    tags: ["resultado", "clareza", "produto", "decisão"],
    align: "right",
  },
  {
    number: "03",
    title: "Quality as Discipline",
    description:
      "Nota A no SonarQube não é acidente. É cultura aplicada commit a commit, sem exceções.",
    signal: "Qualidade entra no fluxo, não como revisão tardia ou esforço de última hora.",
    tags: ["testes", "review", "sonarqube", "consistência"],
    align: "left",
  },
  {
    number: "04",
    title: "Learn in Context",
    description:
      "Aprendizado acelera com propósito real. O mercado não espera condições ideais.",
    signal: "Aprender em produção gera repertório mais rápido do que estudo isolado.",
    tags: ["contexto", "execução", "aprendizado", "adaptação"],
    align: "right",
  },
] as const;

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !listRef.current) return;

    const ctx = gsap.context(() => {
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

      const list = listRef.current;
      if (!list) return;

      const articles = list.querySelectorAll("article");
      articles.forEach((article, index) => {
        const fromX = principles[index].align === "right" ? 80 : -80;
        gsap.from(article, {
          x: fromX,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="principles" className="relative" ref={sectionRef}>
      <Container className="md:px-30">
        <div ref={headerRef} className="mb-14 md:mb-20">
          <Eyebrow>03 / Princípios</Eyebrow>
          <SectionTitle>Como a gente trabalha</SectionTitle>
        </div>

        <div ref={listRef} className="space-y-10 sm:space-y-12 md:space-y-14">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className={`rounded-(--radius) border border-border/30 bg-card/30 px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 ${
                principle.align === "right"
                  ? "text-left md:text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)] md:items-end ${
                  principle.align === "right" ? "md:[&>div:first-child]:order-2 md:[&>div:last-child]:order-1" : ""
                }`}
              >
                <div>
                  <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {principle.number}
                  </span>
                  <h3 className="font-display text-3xl leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    <span className="text-foreground">
                      {principle.title.split(" ").slice(0, -1).join(" ")}
                    </span>
                    <HighlightText className="ml-[0.30em]">
                      {principle.title.split(" ").slice(-1).join(" ")}
                    </HighlightText>
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {principle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[calc(var(--radius)-4px)] border border-border/25 bg-background/25 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    Faixa operacional
                  </p>
                  <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                  <p className="mt-4 border-t border-border/20 pt-4 font-mono text-xs leading-relaxed text-foreground/75">
                    {principle.signal}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
