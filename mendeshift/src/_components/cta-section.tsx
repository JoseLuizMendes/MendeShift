"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { ActionLink } from "@/_components/ui/action-link";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const children = headlineRef.current.querySelectorAll(":scope > *");
        gsap.from(children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (actionsRef.current) {
        gsap.from(actionsRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: actionsRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      id="contact"
      ref={sectionRef}
      className="relative border-t border-border/20"
    >
      <Container className="md:px-30">
        <div className="flex flex-col gap-16 md:gap-20">
          <div ref={headlineRef}>
            <Eyebrow>05 / Contato</Eyebrow>
            <h2 className="mt-4 font-display text-5xl tracking-tight md:text-7xl lg:text-8xl">
              Vamos construir
              <br />
              algo juntos.
            </h2>
            <p className="mt-8 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
              Disponível para projetos freelance e oportunidades em empresas de
              tecnologia. Prefiro conversas diretas sobre o que você precisa
              construir.
            </p>
          </div>

          <div ref={actionsRef} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ActionLink
              href="mailto:josemendess004@gmail.com"
              className="group"
            >
              <ScrambleTextOnHover
                text="josemendess004@gmail.com"
                as="span"
                duration={0.7}
              />
              <BitmapChevron className="transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
            </ActionLink>
            <ActionLink
              href="https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/"
              variant="ghost"
            >
              LinkedIn ↗
            </ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
