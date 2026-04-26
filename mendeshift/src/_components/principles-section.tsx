"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HighlightText } from "@/_components/highlight-text";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

type PrincipleItem = {
  number: string;
  title: string;
  description: string;
  signal: string;
  tags: string;
};

export function PrinciplesSection() {
  const t = useTranslations("principles");
  const principles = t.raw("items") as PrincipleItem[];
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
        const fromX = index % 2 === 1 ? 80 : -80;
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
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
        </div>

        <div ref={listRef} className="space-y-10 sm:space-y-12 md:space-y-14">
          {principles.map((principle, idx) => (
            <article
              key={principle.number}
              className={`flex px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 ${
                idx % 2 === 1
                  ? "justify-end text-right"
                  : "justify-start text-left"
              }`}
            >
              <div className="max-w-3xl">
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
                <div
                  className={`mt-6 flex flex-wrap gap-2 ${
                    principle.align === "right" ? "justify-end" : "justify-start"
                  }`}
                >
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
