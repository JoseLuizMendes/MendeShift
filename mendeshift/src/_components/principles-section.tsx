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
    align: "left",
  },
  {
    number: "02",
    title: "Engineering for Impact",
    description:
      "Código sem impacto é exercício. Cada solução precisa resolver uma dor real do produto.",
    align: "right",
  },
  {
    number: "03",
    title: "Quality as Discipline",
    description:
      "Nota A no SonarQube não é acidente. É cultura aplicada commit a commit, sem exceções.",
    align: "left",
  },
  {
    number: "04",
    title: "Learn in Context",
    description:
      "Aprendizado acelera com propósito real. O mercado não espera condições ideais.",
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

        <div ref={listRef} className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-28">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className={`flex flex-col ${
                principle.align === "right"
                  ? "items-start text-left md:items-end md:text-right"
                  : "items-start text-left"
              }`}
            >
              <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {principle.number}
              </span>
              <h3 className="font-display text-3xl leading-none tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
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
              <div className="mt-8 h-px w-20 bg-border sm:w-24 md:w-48" />
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
