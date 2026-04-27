"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import type { Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  projects: Omit<Project, "pt">[];
};

export function WorkSection({ projects }: Props) {
  const t = useTranslations("work");

  const featuredProjects = projects.slice(0, 2);
  const remainingCount = projects.length - featuredProjects.length;

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
        <div ref={headerRef} className="mb-6 flex flex-col gap-4 md:mb-10">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
          </div>
          <SectionLead className="mt-0">{t("lead")}</SectionLead>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6"
        >
          {featuredProjects.map((item, idx) => (
            <article
              key={item.slug}
              className="group relative overflow-hidden rounded-lg border border-border/40 bg-card/70 p-0 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/60"
            >
              <div className="flex flex-col">
                <div className="px-5 pb-0 pt-5 sm:px-6 sm:pt-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl md:text-4xl">
                    {item.title}
                  </h3>
                </div>

                <div
                  className={`relative mx-5 mt-4 h-44 md:h-56 overflow-hidden rounded-sm border border-border/30 sm:mx-6 ${!item.previewImage ? item.accentGradient : "bg-card/30"}`}
                >
                  {item.previewImage && (
                    <Image
                      src={item.previewImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale brightness-[0.28]"
                      style={{ objectPosition: item.previewImageFocus ?? "center" }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/45 to-background/85" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                    <span>{item.placeholderLabel}</span>
                    <span>{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="max-w-[28ch] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                      {item.placeholderCaption}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <p className="w-full font-mono text-xs leading-relaxed text-muted-foreground">
                    {item.shortDesc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {item.metric ?? String(idx + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/projetos/${item.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-accent"
                    >
                      <ScrambleTextOnHover text={t("view_case")} as="span" duration={0.45} />
                      <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/20 pt-6 md:mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
            {t("more", { count: remainingCount })}
          </p>
          <Link
            href="/projetos"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent transition-colors duration-300 hover:text-accent/75"
          >
            {t("explore")}
            <BitmapChevron className="w-3 rotate-90" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
