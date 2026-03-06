"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    period: "Out/2024 — Presente",
    role: "Analista de TI",
    company: "PRODEST",
    detail:
      "Instituto de Tecnologia do Governo do ES. Sistemas críticos de estado, SonarQube Grade A em 3 sistemas, roadmap estratégico do Novo SIARHES — projeto adotado por outros estados do Brasil.",
  },
  {
    period: "2024 — Presente",
    role: "Ciência da Computação",
    company: "FAESA",
    detail:
      "Formação em engenharia de software, arquitetura de sistemas e fundamentos de ciência da computação.",
  },
];

const stats = [
  { value: "Grade A", label: "SonarQube — 3 sistemas críticos" },
  { value: "17°", label: "No Brasil — Colégio Sagrado Coração de Maria" },
  { value: "07/09", label: "Casamento — projeto entregue" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

      if (contentRef.current) {
        const children = contentRef.current.querySelectorAll(":scope > *");
        gsap.from(children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll(":scope > *");
        gsap.from(items, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="about" className="relative" ref={sectionRef}>
      <Container className="md:px-30">
        <div ref={headerRef} className="mb-16">
          <Eyebrow>00 / Perfil</Eyebrow>
          <SectionTitle>O engenheiro por trás do código</SectionTitle>
        </div>

        <div
          ref={contentRef}
          className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start"
        >
          {/* Left — story + timeline */}
          <div className="space-y-12">
            <div className="space-y-5">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                MendeShift não é apenas um portfólio — é a prova de que
                engenharia de produto começa muito antes de abrir o editor.
                Começa em entender o problema, modelar a solução e carregar
                a responsabilidade do resultado de ponta a ponta.
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                José Luiz foi 1° lugar no Espírito Santo e 17° no Brasil pelo
                Colégio Sagrado Coração de Maria. Essa disciplina define como
                cada projeto é executado até hoje.
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Atualmente atua no PRODEST — Instituto de Tecnologia do Governo
                do ES — onde liderou o mapeamento técnico do SIARHES, entregou
                Nota A em todas as métricas do SonarQube e elaborou o roadmap
                estratégico para migração adotado por outros estados do Brasil.
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Interesses em neurociência, música e finanças criam uma leitura
                analítica diferente dos problemas. Quando tecnologia encontra
                clareza de propósito, os resultados mudam de escala.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Trajetória
              </p>
              {timeline.map((item) => (
                <Card
                  key={item.company}
                  className="border-border/40 bg-card/60 p-6"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <span className="font-display text-xl tracking-tight">
                        {item.role}
                      </span>
                      <span className="ml-2 font-mono text-xs text-accent">
                        · {item.company}
                      </span>
                    </div>
                    <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                      {item.period}
                    </time>
                  </div>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right — photo + quote */}
          <div className="flex flex-col gap-6">
            {/*
              TODO: adicionar sua foto.
              Coloque o arquivo em /public/foto-jose.jpg e substitua o placeholder abaixo:

              import Image from "next/image";
              <Image
                src="/foto-jose.jpg"
                alt="José Luiz Mendes"
                fill
                className="object-cover grayscale"
              />
            */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-border/40 bg-card/60">
              <div className="flex h-full items-center justify-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/30">
                  foto
                </p>
              </div>
            </div>

            <Card className="border-border/40 bg-card/60 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                motivação
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                Quando decidi me casar, ainda não dominava programação.
                Usei o casamento como combustível para aprender.
                O resultado virou o projeto mais completo do portfólio.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <Card
              key={stat.value}
              className="border-border/40 bg-card/60 p-6 text-center"
            >
              <p className="font-display text-4xl tracking-tight text-accent">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
