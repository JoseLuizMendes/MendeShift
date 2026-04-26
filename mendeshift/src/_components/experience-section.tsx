"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Separator } from "@/_components/ui/separator";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import type { ExperienceData } from "@/lib/experience";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection({
  currentRole,
  experienceAchievements,
  techStack,
  educationEntries,
}: ExperienceData) {
  const t = useTranslations("experience_section");
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
          immediateRender: false,
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
          immediateRender: false,
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
          immediateRender: false,
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
          <Eyebrow>{t("eyebrow_experience")}</Eyebrow>
          <SectionTitle>{t("title_experience")}</SectionTitle>
          <SectionLead>{t("lead_experience")}</SectionLead>
        </div>

        {/* Role header */}
        <div ref={roleRef}>
          <Card className="mb-10 border-border/40 bg-card/60 p-6 md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                  {currentRole.title}
                </h3>
                <p className="mt-1 font-mono text-sm text-accent">
                  {currentRole.organization}
                </p>
              </div>
              <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                {currentRole.period}
              </time>
            </div>
            <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {currentRole.summary}
            </p>
          </Card>
        </div>

        {/* Achievements — SIARHES destacado */}
        <div ref={listRef} className="grid gap-4 md:grid-cols-2">
          {experienceAchievements.map((item, index) => (
            <Card
              key={item.label}
              className={`group border-border/40 bg-card/60 p-5 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-accent/50 sm:p-6 ${
                index === 0 ? "md:col-span-2 border-accent/30 bg-accent/5" : ""
              }`}
            >
              <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
                  index === 0 ? "text-accent" : "text-muted-foreground"
                }`}>
                  {item.label}
                </p>
                <h4 className="mt-3 font-display text-xl tracking-tight sm:text-2xl">
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

        <div className="mt-18 md:mt-24">
          <Separator />
        </div>

        {/* Tech Stack */}
        <div className="mt-18 md:mt-24">
          <Eyebrow>{t("eyebrow_stack")}</Eyebrow>
          <h3 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
            {t("title_stack")}
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((entry) => (
              <Card key={entry.category} className="border-border/40 bg-card/60 p-5 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {entry.category}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/40 bg-background/40 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-18 md:mt-24">
          <Eyebrow>{t("eyebrow_education")}</Eyebrow>
          <div className="mt-8 grid gap-4">
            {educationEntries.map((entry) => (
              <Card key={entry.title} className="border-border/40 bg-card/60 p-5 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {entry.label}
                    </p>
                    <h4 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                      {entry.title}
                    </h4>
                    <span className="font-mono text-xs text-accent">· {entry.institution}</span>
                  </div>
                  <time className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
                    {entry.period}
                  </time>
                </div>
                {entry.detail && (
                  <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                    {entry.detail}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
