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
    title: "Interface Minimalism",
    description:
      "Reduzir até restar apenas o essencial. Cada elemento precisa justificar presença.",
    align: "left",
  },
  {
    number: "02",
    title: "Systems over Screens",
    description:
      "Projetar comportamento antes de layout. Escala vem de regras, não de improviso.",
    align: "right",
  },
  {
    number: "03",
    title: "Controlled Tension",
    description:
      "Equilíbrio entre contenção e expressão, com contraste e ritmo visual.",
    align: "left",
  },
  {
    number: "04",
    title: "Signal Clarity",
    description:
      "Comunicação direta em cada interação: menos ruído, mais intenção.",
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
        <div ref={headerRef} className="mb-20">
          <Eyebrow>03 / Princípios</Eyebrow>
          <SectionTitle>Como a gente trabalha</SectionTitle>
        </div>

        <div ref={listRef} className="space-y-24 md:space-y-28">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className={`flex flex-col ${
                principle.align === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
              }`}
            >
              <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {principle.number}
              </span>
              <h3 className="font-display text-5xl leading-none tracking-tight md:text-7xl lg:text-8xl">
                <span className="text-foreground">
                  {principle.title.split(" ").slice(0, -1).join(" ")}
                </span>
                <HighlightText className="ml-[0.30em]">
                  {principle.title.split(" ").slice(-1).join(" ")}
                </HighlightText>
              </h3>
              <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
              <div className="mt-8 h-px w-24 bg-border md:w-48" />
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
