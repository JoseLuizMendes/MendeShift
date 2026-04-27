"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Container } from "@/_components/ui/container";
import { Eyebrow, Section } from "@/_components/ui/section";
import { ContactChat } from "./contact-chat";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const t = useTranslations("contact");
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      id="contact"
      ref={sectionRef}
      className="relative border-t border-border/20">
      <Container className="md:px-30">
        <div className="flex flex-col gap-12 lg:gap-16">
          {/* Header */}
          <div ref={headlineRef}>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-display text-[2rem] leading-none tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
              {t("headline_1")}
              <br className="hidden sm:block" />
              {t("headline_2")}
            </h2>
            <p className="mt-8 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
              {t("availability")}
            </p>
          </div>

          <ContactChat />
        </div>
      </Container>
    </Section>
  );
}
