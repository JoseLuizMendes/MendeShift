"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n/context";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";
import { ShaderImage } from "@/_components/shader-image";
import { AnimatedNoise } from "@/_components/animated-noise";
import { BitmapChevron } from "@/_components/bitmap-chevron";
import {
  SplitFlapAudioProvider,
  SplitFlapMuteToggle,
  SplitFlapText,
} from "@/_components/split-flap-text";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";
import { StarBorder } from "@/_components/ui/star-border";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const t = useTranslations("hero");
  const visuals = useTranslations("portfolio");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrambleToken, setScrambleToken] = useState(0);
  const [splitFlapReady, setSplitFlapReady] = useState(false);

  useEffect(() => {
    const navType = (
      performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    )?.type;
    // Espelha a condição do Preloader (que também pula em reduced motion).
    const willShowPreloader =
      (navType === "navigate" || navType === "reload") && !prefersReducedMotion();

    if (!willShowPreloader) {
      // rAF em vez de setState síncrono no corpo do efeito (regra do
      // React Compiler contra renders em cascata).
      const raf = requestAnimationFrame(() => setSplitFlapReady(true));
      return () => cancelAnimationFrame(raf);
    }

    const handleDone = () => setSplitFlapReady(true);
    window.addEventListener("preloader:done", handleDone, { once: true });
    return () => window.removeEventListener("preloader:done", handleDone);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    if (prefersReducedMotion()) return;

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

  const triggerScramble = () => {
    setScrambleToken((current) => current + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[min(48rem,calc(100svh-5rem))] items-center overflow-hidden py-16 sm:py-20 md:py-24"
    >
      <ShaderImage
        className="hero-shader"
        src="/portfolio/hero.webp"
        alt=""
        sizes="100vw"
        position={0.72}
        trackParent
        priority
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
                <SplitFlapText text="MendeShift" speed={80} ready={splitFlapReady} />
              </div>
              <SplitFlapMuteToggle className="mt-4" />

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <div className="min-w-0">
                  <h2 className="max-w-2xl font-display text-xl tracking-wide text-foreground sm:text-2xl md:text-4xl">
                    {t("headline")}
                  </h2>
                  <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-foreground/80 sm:mt-8">
                    {t("sub")}
                  </p>

                  <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center">
                    <StarBorder
                      className="w-full sm:w-auto"
                      innerClassName="bg-background"
                      thickness={2}
                    >
                      <Button
                        href="#services"
                        className="group w-full justify-center border-transparent sm:w-auto"
                        onMouseEnter={triggerScramble}
                        onFocus={triggerScramble}
                      >
                        <ScrambleTextOnHover
                          text={t("cta_primary")}
                          as="span"
                          duration={0.55}
                          className="text-[10px] transition-colors interaction-motion"
                          triggerToken={scrambleToken}
                        />
                        <BitmapChevron className="transition-transform interaction-motion group-hover:rotate-45" />
                      </Button>
                    </StarBorder>
                    <Button
                      href="#work"
                      variant="secondary"
                      specular
                      className="w-full justify-center sm:w-auto"
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
    </section>
  );
}
