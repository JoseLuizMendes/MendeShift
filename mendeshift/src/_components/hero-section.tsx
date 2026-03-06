"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AnimatedNoise } from "@/_components/animated-noise";
import { BitmapChevron } from "@/_components/bitmap-chevron";
import {
  SplitFlapAudioProvider,
  SplitFlapMuteToggle,
  SplitFlapText,
} from "@/_components/split-flap-text";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -90,
        opacity: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden pb-24 pt-24 md:pb-28 md:pt-28"
    >
      <AnimatedNoise opacity={0.03} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-transparent via-border/40 to-transparent md:left-16" />
      </div>

      <Container className="md:pr-20">
        <div ref={contentRef} className="space-y-10">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Product Engineer / Vitória, ES
            </p>

            <SplitFlapAudioProvider>
              <div className="mt-4">
                <SplitFlapText text="MendeShift" speed={80} />
              </div>
              <SplitFlapMuteToggle className="mt-4" />

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl tracking-wide text-muted-foreground/70 md:text-4xl">
                    Engenharia de produto.
                    Do banco de dados à interface do usuário.
                  </h2>
                  <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
                    A gente constrói produtos completos — da modelagem da
                    arquitetura até a experiência final do usuário — com foco
                    em impacto real e entrega com excelência.
                  </p>

                  <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <ActionLink href="#work" className="group">
                      <ScrambleTextOnHover text="Ver projetos" as="span" duration={0.55} />
                      <BitmapChevron className="transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
                    </ActionLink>
                    <ActionLink href="#about" variant="ghost">
                      Sobre o MendeShift
                    </ActionLink>
                  </div>
                </div>

                <div className="w-full lg:max-w-sm lg:justify-self-start lg:-ml-59 xl:-ml-59">
                  <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />

                    <div className="p-8">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        foco
                      </p>

                      <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">
                        Entender a dor do cliente antes de abrir o editor.
                        Produto sem clareza de propósito é complexidade sem valor.
                      </p>
                    </div>

                    <div className="h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent" />

                    <div className="p-8">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        entrega
                      </p>

                      <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">
                        Levantamento → arquitetura → implementação → qualidade.
                        Sem atalhos. Sem dívida técnica invisível.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>
        </div>
      </Container>
    </section>
  );
}
