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
        <div ref={contentRef} className="flex items-end justify-between gap-8">
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              v0.2 / build editorial
            </p>

            <SplitFlapAudioProvider>
              <div className="mt-4">
                <SplitFlapText text="MendeShift" speed={55} />
              </div>
              <SplitFlapMuteToggle className="mt-4" />
            </SplitFlapAudioProvider>

            <h2 className="mt-3 font-display text-2xl tracking-wide text-muted-foreground/70 md:text-4xl">
              Estudos de Interface em Ambientes Controlados
            </h2>
            <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
              A gente projeta sistemas que se comportam bem sob pressão: tokens,
              componentes e hierarquia visual com clareza.
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <ActionLink href="#work">
                <ScrambleTextOnHover text="Ver experimentos" as="span" duration={0.55} />
                <BitmapChevron className="transition-transform duration-400 ease-emphasis group-hover:rotate-45" />
              </ActionLink>
              <ActionLink href="#signals" variant="ghost">
                Últimos sinais
              </ActionLink>
            </div>
          </div>

          <div className="hidden w-full max-w-sm md:block">
            <Card className="overflow-hidden border-border/40 bg-card/60 p-8 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                foco
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                Interfaces premium não nascem de efeito; nascem de decisões
                pequenas repetidas com consistência.
              </p>
              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent" />
              <p className="mt-6 font-mono text-xs leading-relaxed text-muted-foreground">
                Entrega: análise → design system → implementação.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
