"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    no: "No. 01",
    category: "Web",
    title: "Aplicações Web Fullstack",
    desc: "Next.js, React, Node.js e PostgreSQL. Do banco de dados à interface, com arquitetura pensada para escalar.",
  },
  {
    no: "No. 02",
    category: "Backend",
    title: "APIs & Integrações",
    desc: "REST APIs com autenticação JWT, webhooks, pagamentos e integrações com serviços externos.",
  },
  {
    no: "No. 03",
    category: "Qualidade",
    title: "Testes & Qualidade",
    desc: "Testes unitários, E2E com Playwright e métricas verificáveis. SonarQube Grade A em projetos críticos.",
  },
  {
    no: "No. 04",
    category: "Infra",
    title: "Containers & Deploy",
    desc: "Docker, Docker Compose e deploy em produção. CI/CD com Azure DevOps e boas práticas de entrega.",
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
    <Section id="services" className="relative" ref={sectionRef}>
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
          <Eyebrow>01 / Serviços</Eyebrow>
          <SectionTitle>O que construo</SectionTitle>
          <SectionLead>
            Especialidades e áreas de atuação — do backend à interface.
          </SectionLead>
        </div>

        <div className="relative overflow-hidden pb-6">
          <div ref={cardsRef} className="signals-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-6 pr-6">
                {services.map((item, index) => (
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
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {item.category}
                        </span>
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
