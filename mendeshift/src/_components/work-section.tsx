"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

const experiments = [
  {
    k: "Full Stack",
    t: "Wedding Platform",
    d: "Plataforma completa construída para o próprio casamento. RSVP, pagamentos via Mercado Pago, galeria colaborativa, webhooks e testes E2E. Next.js 15 + PostgreSQL.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    k: "Product",
    t: "Barber SaaS",
    d: "Sistema de agendamento multi-tenant com autenticação, containerização Docker e deploy em produção. Next.js + Prisma + PostgreSQL.",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    k: "Gov Tech",
    t: "SIARHES",
    d: "Mapeamento técnico do sistema de RH do Governo do ES. Roadmap estratégico para migração adotado por outros estados do Brasil.",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    k: "Backend",
    t: "REST API",
    d: "API em Java/Spring Boot com arquitetura em camadas, autenticação JWT, consultas otimizadas e containerização com Docker.",
    span: "md:col-span-4 md:row-span-1",
  },
];

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return;

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
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = gridRef.current?.querySelectorAll("article");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
    <Section id="work" className="relative" ref={sectionRef}>
      <Container className="md:px-30">
        <div ref={headerRef} className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>02 / Projetos</Eyebrow>
            <SectionTitle>Selected Work</SectionTitle>
          </div>
          <SectionLead className="mt-0 max-w-sm text-left md:text-right">
            Produtos construídos de ponta a ponta — arquitetura, desenvolvimento
            e entrega com qualidade de produção.
          </SectionLead>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[190px] md:gap-6"
        >
          {experiments.map((item, idx) => (
            <Card
              key={item.t}
              className={`group border-border/40 bg-card/70 p-6 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/60 ${item.span}`}
            >
              <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.k}
                  </p>
                  <h3 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                    {item.t}
                  </h3>
                </div>
                <div>
                  <p className="max-w-[34ch] font-mono text-xs leading-relaxed text-muted-foreground">
                    {item.d}
                  </p>
                  <span className="mt-5 block font-mono text-[10px] text-muted-foreground/50">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
