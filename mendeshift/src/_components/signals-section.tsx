"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type ServiceItem = {
  no: string;
  category: string;
  title: string;
  desc: string;
};

export function SignalsSection() {
  const t = useTranslations("services");
  const services = t.raw("items") as ServiceItem[];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return;

    const section = sectionRef.current;
    const cursor = cursorRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = cardsRef.current?.querySelectorAll("article");
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
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
    <Section id="services" className="relative overflow-x-hidden" ref={sectionRef}>
      <Container className="md:px-30">
        <div
          ref={cursorRef}
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-1/2 md:block",
            "h-12 w-12 rounded-full border-2 border-accent bg-accent",
            "transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0",
          )}
        />

        <div ref={headerRef} className="mb-12">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
          <SectionLead>{t("lead")}</SectionLead>
        </div>

        <div className="relative overflow-hidden pb-4 sm:pb-6">
          <div ref={cardsRef} className="signals-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6">
                {services.map((item, index) => (
                  <article
                    key={`${item.no}-${copy}-${index}`}
                    className="group relative flex w-72 shrink-0 transition-transform duration-500 ease-emphasis hover:-translate-y-2 sm:w-80"
                  >
                    <Card className="flex h-full min-h-69 flex-1 flex-col border-border/50 bg-card/80 p-6 sm:min-h-75 sm:p-8">
                      <div className="absolute -top-px left-0 right-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />

                      <div className="mb-6 flex items-baseline justify-between sm:mb-8">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          {item.no}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h3 className="font-display text-3xl tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-4xl">
                          {item.title}
                        </h3>
                        <div className="mb-6 mt-4 h-px w-12 bg-accent/70 transition-all duration-500 group-hover:w-full" />
                        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </Card>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
