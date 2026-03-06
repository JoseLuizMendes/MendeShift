"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    label: "SIARHES",
    title: "Roadmap estratégico adotado por outros estados",
    detail:
      "Liderou o mapeamento completo dos sistemas integrados ao SIARHES — Sistema de RH do Governo do ES. Conduziu entrevistas com responsáveis pelo desenvolvimento, consolidou dados e elaborou o roadmap para migração ao Novo SIARHES. O projeto foi levado para estudo e implementação em Santa Catarina.",
  },
  {
    label: "Qualidade",
    title: "SonarQube Grade A em 3 sistemas críticos",
    detail:
      "Assumiu a responsabilidade pelo Portal do Servidor, Sistema de Seleção e Sistema CHE. Implementou melhorias que elevaram todas as métricas de qualidade para Nota A em cada categoria avaliada pelo SonarQube.",
  },
  {
    label: "Desenvolvimento",
    title: "Sistemas em C# (.NET / ASP.NET)",
    detail:
      "Desenvolvimento e manutenção de sistemas governamentais em C# com .NET e ASP.NET — correção de bugs, novas funcionalidades e criação de APIs para integração entre sistemas.",
  },
  {
    label: "DevOps",
    title: "Azure DevOps & Git",
    detail:
      "Gestão de versionamento e ciclo de vida de aplicações com Azure DevOps e Git. Uso de repositórios, pipelines e boas práticas de integração contínua.",
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

      if (roleRef.current) {
        gsap.from(roleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: roleRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (listRef.current) {
        const cards = listRef.current.querySelectorAll(":scope > *");
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="experience" className="relative" ref={sectionRef}>
      <Container className="md:px-30">
        <div ref={headerRef} className="mb-12">
          <Eyebrow>01 / Experiência</Eyebrow>
          <SectionTitle>Trabalho profissional</SectionTitle>
          <SectionLead>
            Engenharia de software em produção, em projetos estratégicos do
            Governo do Estado do Espírito Santo.
          </SectionLead>
        </div>

        {/* Role header */}
        <div ref={roleRef}>
          <Card className="mb-10 border-border/40 bg-card/60 p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="font-display text-3xl tracking-tight">
                  Analista de TI
                </h3>
                <p className="mt-1 font-mono text-sm text-accent">
                  PRODEST — Instituto de Tecnologia da Informação e Comunicação do Estado do ES
                </p>
              </div>
              <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                Out/2024 — Presente
              </time>
            </div>
            <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
              Atendimento técnico de primeiro e segundo nível, desenvolvimento e manutenção de sistemas,
              testes unitários, modelagem de processos com UML e administração de banco de dados com
              SQL Developer. Participação em projetos estratégicos do Governo do Estado.
            </p>
          </Card>
        </div>

        {/* Achievements */}
        <div ref={listRef} className="grid gap-4 md:grid-cols-2">
          {achievements.map((item) => (
            <Card
              key={item.label}
              className="group border-border/40 bg-card/60 p-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-accent/50"
            >
              <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {item.label}
                </p>
                <h4 className="mt-3 font-display text-2xl tracking-tight">
                  {item.title}
                </h4>
                <div className="mb-4 mt-3 h-px w-8 bg-accent/60 transition-all duration-500 group-hover:w-full" />
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Education */}
        <div className="mt-40">
          <Card className="border-border/40 bg-card/60 p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Formação
                </p>
                <h4 className="mt-2 font-display text-2xl tracking-tight">
                  Ciência da Computação
                </h4>
                <span className="font-mono text-xs text-accent">· FAESA</span>
              </div>
              <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                2024 — Presente
              </time>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
