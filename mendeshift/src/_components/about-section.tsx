"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";
import { ProfileCard } from "@/_components/profile-card";

gsap.registerPlugin(ScrollTrigger);

type SignalItem = { title: string; description: string };
type ProfileCard = { eyebrow: string; title: string; description: string };

export function AboutSection() {
  const t = useTranslations("about");
  const operatingSignals = t.raw("signals") as SignalItem[];
  const profileCards = t.raw("profile_cards") as ProfileCard[];
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
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
        </div>

        <div
          ref={contentRef}
          className="grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"
        >
          {/* Left — story + timeline */}
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-5">
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                {t("p1")}
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                {t("p2")}
              </p>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                {t("p3")}
              </p>
            </div>

            <div>
              <ActionLink href="/experience" variant="ghost" className="px-0 text-accent hover:text-accent/80">
                {t("cta")}
              </ActionLink>
            </div>

            <div className="relative overflow-hidden rounded-(--radius) border border-border/35 bg-card/45 p-6 sm:p-7 md:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
              <div className="grid gap-6 md:grid-cols-2 md:items-start lg:grid-cols-[minmax(0,1.2fr)_220px]">
                <div className="space-y-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    {t("operating_base")}
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
                  <div className="rounded-md border border-border/25 bg-background/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {t("profile_label")}
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-accent">
                      {t("profile_value")}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/25 bg-background/25 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {t("mode_label")}
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-foreground">
                      {t("mode_value")}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/25 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {t("focus_label")}
                    </p>
                    <p className="mt-3 font-display text-2xl tracking-tight text-foreground">
                      {t("focus_value")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right — photo + quote */}
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6 sm:max-w-md lg:mx-0 lg:max-w-none">
            <ProfileCard />

            <Card className="border-border/40 bg-card/60 p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {t("motivation_label")}
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                {t("motivation_text")}
              </p>
            </Card>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
