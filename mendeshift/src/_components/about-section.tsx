"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

const operatingSignals = [
  {
    title: "Produção como referência",
    description:
      "Trabalho diário com sistemas públicos e fluxo real de manutenção, evolução e incidentes evitáveis.",
  },
  {
    title: "Arquitetura sem excesso",
    description:
      "Prefiro decisões que simplificam operação, dão legibilidade ao código e mantêm margem de escala.",
  },
  {
    title: "Aprendizado orientado a entrega",
    description:
      "Projetos pessoais entram em produção porque servem como laboratório real de produto, qualidade e deploy.",
  },
];

const profileCards = [
  {
    eyebrow: "Atuação",
    title: "Sistemas críticos com impacto público",
    description:
      "No PRODEST, atuo em produtos usados por milhares de servidores. Isso molda minhas decisões para estabilidade, clareza e manutenção contínua.",
  },
  {
    eyebrow: "Método",
    title: "Execução disciplinada, sem teatro técnico",
    description:
      "Boa engenharia, para mim, é alinhar contexto, modelagem, testes e entrega. A solução precisa funcionar sob pressão, não só parecer bonita no repositório.",
  },
  {
    eyebrow: "Direção",
    title: "Construir software com propósito nítido",
    description:
      "Meu interesse está em produtos que resolvem dores reais. Quando o problema é claro, consigo ir do desenho ao deploy com muito menos ruído.",
  },
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
        <div ref={headerRef} className="mb-12 md:mb-16">
          <Eyebrow>04 / Perfil</Eyebrow>
          <SectionTitle>O engenheiro por trás do código</SectionTitle>
        </div>

        <div
          ref={contentRef}
          className="grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"
        >
          {/* Left — story + timeline */}
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-5">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Sou José Luiz Mendes — o engenheiro por trás do MendeShift.
                Trabalho no PRODEST, o instituto de tecnologia do Governo do
                Espírito Santo, desenvolvendo e mantendo sistemas que atendem
                milhares de servidores públicos.
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Fui 1° lugar no Espírito Santo e 17° no Brasil pelo Colégio
                Sagrado Coração de Maria. Essa disciplina define como executo
                projetos até hoje — sem atalhos, sem dívida técnica invisível.
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Interesses em neurociência, música e finanças constroem uma
                leitura analítica diferente dos problemas. Quando clareza de
                propósito encontra engenharia bem feita, os resultados mudam
                de escala.
              </p>
            </div>

            <div>
              <ActionLink href="/experience" variant="ghost" className="px-0 text-accent hover:text-accent/80">
                Ver trajetória profissional e acadêmica
              </ActionLink>
            </div>

            <div className="relative overflow-hidden rounded-(--radius) border border-border/35 bg-card/45 p-6 sm:p-7 md:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_220px] lg:items-start">
                <div className="space-y-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    Base operacional
                  </p>
                  {operatingSignals.map((signal) => (
                    <div key={signal.title} className="grid gap-3 border-l border-accent/35 pl-4 sm:pl-5">
                      <p className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                        {signal.title}
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[calc(var(--radius)-6px)] border border-border/25 bg-background/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Ambiente
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-accent">
                      PRODEST
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-6px)] border border-border/25 bg-background/25 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Foco
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-foreground">
                      Produto + Qualidade
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-6px)] border border-border/25 bg-linear-to-br from-accent/12 via-transparent to-transparent p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Direção
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-foreground">
                      Entregar com contexto
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right — photo + quote */}
          <div className="mx-auto flex w-full max-w-md flex-col gap-6 lg:mx-0 lg:max-w-none">
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
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-sm border border-border/40 bg-linear-to-br from-card via-card/85 to-background">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_58%)]" />
              <div className="flex h-full flex-col justify-between p-6">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                  <span>placeholder</span>
                  <span>perfil</span>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-[14px] border border-border/25 bg-background/20" />
                    <div className="h-24 rounded-[14px] border border-border/20 bg-background/10" />
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60">
                    Espaço reservado para retrato editorial em alto contraste.
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-border/40 bg-card/60 p-5 sm:p-6">
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

        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {profileCards.map((card) => (
            <Card
              key={card.title}
              className="border-border/40 bg-card/60 p-5 sm:p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {card.eyebrow}
              </p>
              <p className="mt-4 font-display text-2xl leading-tight tracking-tight text-foreground sm:text-3xl">
                {card.title}
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
