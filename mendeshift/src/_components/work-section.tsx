"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

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
          immediateRender: false,
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
            immediateRender: false,
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
        <div ref={headerRef} className="mb-10 flex flex-col gap-4 sm:gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>02 / Projetos</Eyebrow>
            <SectionTitle>Selected Work</SectionTitle>
          </div>
          <div className="max-w-md md:text-right">
            <SectionLead className="mt-0 text-left md:text-right">
              Produtos construídos de ponta a ponta — arquitetura, desenvolvimento
              e entrega com qualidade de produção.
            </SectionLead>
            <Link
              href="/projetos"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent transition-colors duration-300 hover:text-accent/75"
            >
              Explorar arquivo completo
              <BitmapChevron className="w-3 rotate-90" />
            </Link>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-4 md:auto-rows-[220px] md:gap-6"
        >
          {projects.map((item, idx) => (
            <article
              key={item.slug}
              className={`group relative overflow-hidden rounded-lg border border-border/40 bg-card/70 p-5 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/60 sm:p-6 ${item.gridSpan}`}
            >
              <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl md:text-4xl">
                    {item.title}
                  </h3>
                </div>

                <div
                  className={`relative min-h-36 flex-1 overflow-hidden rounded-sm border border-border/30 bg-linear-to-br ${item.accentGradient}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--foreground)_12%,transparent),transparent_60%)]" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                    <span>{item.placeholderLabel}</span>
                    <span>{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded-[10px] border border-border/30 bg-background/25" />
                      <div className="h-10 rounded-[10px] border border-border/20 bg-background/15" />
                      <div className="h-10 rounded-[10px] border border-border/20 bg-background/10" />
                    </div>
                    <p className="mt-3 max-w-[28ch] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                      {item.placeholderCaption}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="max-w-[34ch] font-mono text-xs leading-relaxed text-muted-foreground">
                    {item.shortDesc}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {item.metric ?? String(idx + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/projetos/${item.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-accent"
                    >
                      <ScrambleTextOnHover
                        text="Ver case study"
                        as="span"
                        duration={0.45}
                      />
                      <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
