"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const signals = [
  {
    no: "No. 01",
    date: "2026.03.05",
    title: "Signal Field",
    desc: "Novo padrão para superfícies editoriais em dark mode.",
  },
  {
    no: "No. 02",
    date: "2026.03.03",
    title: "Silent Agent",
    desc: "Camada de consistência para componentes e micro-estados.",
  },
  {
    no: "No. 03",
    date: "2026.03.01",
    title: "Noir Grid",
    desc: "Sistema tipográfico para leitura e escaneabilidade.",
  },
  {
    no: "No. 04",
    date: "2026.02.27",
    title: "Lattice",
    desc: "Estrutura modular para seções adaptáveis.",
  },
];

export function SignalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return;

    const section = sectionRef.current;
    const cursor = cursorRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = cardsRef.current?.querySelectorAll("article");
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="signals" className="relative" ref={sectionRef}>
      <Container className="md:px-30">
        <div
          ref={cursorRef}
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2",
            "h-12 w-12 rounded-full border-2 border-accent bg-accent",
            "transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0",
          )}
        />

        <div ref={headerRef} className="mb-12">
          <Eyebrow>01 / Sinais</Eyebrow>
          <SectionTitle>O que está no radar</SectionTitle>
          <SectionLead>
            Notas curtas sobre decisões de interface que melhoram qualidade
            percebida e manutenção.
          </SectionLead>
        </div>

        <div className="relative overflow-hidden pb-6">
          <div ref={cardsRef} className="signals-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-6 pr-6">
                {signals.map((item, index) => (
                  <article
                    key={`${item.no}-${copy}-${index}`}
                    className="group relative w-80 shrink-0 transition-transform duration-500 ease-emphasis hover:-translate-y-2"
                  >
                    <Card className="border-border/50 bg-card/80 p-8">
                      <div className="absolute -top-px left-0 right-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />

                      <div className="mb-8 flex items-baseline justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          {item.no}
                        </span>
                        <time className="font-mono text-[10px] text-muted-foreground/60">
                          {item.date}
                        </time>
                      </div>

                      <h3 className="font-display text-4xl tracking-tight transition-colors duration-300 group-hover:text-accent">
                        {item.title}
                      </h3>
                      <div className="mb-6 mt-4 h-px w-12 bg-accent/70 transition-all duration-500 group-hover:w-full" />
                      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </Card>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
