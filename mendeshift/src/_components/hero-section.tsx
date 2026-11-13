"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ShaderImage } from "@/_components/shader-image";
import { AnimatedNoise } from "@/_components/animated-noise";
import { PortfolioCta } from "@/_components/portfolio-cta";
import {
  SplitFlapAudioProvider,
  SplitFlapMuteToggle,
  SplitFlapText,
} from "@/_components/split-flap-text";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const t = useTranslations("hero");
  const visuals = useTranslations("portfolio");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    const motion = gsap.matchMedia();
    motion.add("(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
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

    return () => motion.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[min(36rem,calc(100svh-6.25rem))] items-center overflow-hidden py-12 sm:min-h-[min(48rem,calc(100svh-5rem))] sm:py-20 md:py-24"
    >
      <ShaderImage
        className="hero-shader"
        src="/portfolio/hero.webp"
        alt=""
        sizes="100vw"
        position={0.72}
        trackParent
        priority
        quality={75}
      />
      <AnimatedNoise opacity={0.03} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-transparent via-border/40 to-transparent md:left-16" />
      </div>

      <Container className="relative z-10 md:px-20">
        <div ref={contentRef} className="space-y-8 sm:space-y-10">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("tagline")}
            </p>

            <SplitFlapAudioProvider>
              <div className="mt-4">
                <SplitFlapText text="MendeShift" speed={55} />
              </div>
              <SplitFlapMuteToggle className="min-h-11 md:mt-4 md:min-h-0" />

              <div className="mt-4 grid gap-10 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <div className="min-w-0">
                  <h1 className="max-w-2xl font-display text-3xl leading-none tracking-wide text-foreground sm:text-2xl sm:leading-normal md:text-4xl">
                    {t("headline")}
                  </h1>
                  <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-foreground/80 sm:mt-8">
                    {t("sub")}
                  </p>

                  <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
                    <PortfolioCta href="/contato" label={t("cta_primary")} className="min-h-11 w-full sm:w-auto" />
                    <Button
                      href="#work"
                      variant="secondary"
                      specular
                      className="min-h-11 w-full justify-center sm:w-auto"
                    >
                      {t("cta_secondary")}
                    </Button>
                  </div>
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>
        </div>
      </Container>
      <span className="hero-shader-hint portfolio-mono" aria-hidden="true">
        {visuals("hover_hint")} <span className="text-accent">+</span>
      </span>
      <span className="shader-touch-hint portfolio-mono" aria-hidden="true">
        {visuals("touch_hint")} <span className="text-accent">+</span>
      </span>
    </section>
  );
}
