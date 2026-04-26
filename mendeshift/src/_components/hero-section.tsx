"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n/context";

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
import { Container } from "@/_components/ui/container";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrambleToken, setScrambleToken] = useState(0);

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

  const triggerScramble = () => {
    setScrambleToken((current) => current + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden pb-16 pt-18 sm:pb-20 sm:pt-24 md:pb-28 md:pt-28"
    >
      <AnimatedNoise opacity={0.03} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-transparent via-border/40 to-transparent md:left-16" />
      </div>

      <Container className="md:px-20">
        <div ref={contentRef} className="space-y-8 sm:space-y-10">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("tagline")}
            </p>

            <SplitFlapAudioProvider>
              <div className="mt-4">
                <SplitFlapText text="MendeShift" speed={80} />
              </div>
              <SplitFlapMuteToggle className="mt-4" />

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <div className="min-w-0">
                  <h2 className="font-display text-xl tracking-wide text-muted-foreground/70 sm:text-2xl md:text-4xl">
                    {t("headline")}
                  </h2>
                  <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground sm:mt-8">
                    {t("sub")}
                  </p>

                  <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center">
                    <ActionLink
                      href="#work"
                      className="group w-full justify-center sm:w-auto"
                      onMouseEnter={triggerScramble}
                      onFocus={triggerScramble}
                    >
                      <ScrambleTextOnHover
                        text={t("cta_primary")}
                        as="span"
                        duration={0.55}
                        className="text-[10px] transition-colors duration-300"
                        triggerToken={scrambleToken}
                      />
                      <BitmapChevron className="transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
                    </ActionLink>
                    <ActionLink
                      href="#about"
                      variant="ghost"
                      className="w-full justify-center sm:w-auto"
                    >
                      {t("cta_secondary")}
                    </ActionLink>
                  </div>
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>
        </div>
      </Container>
    </section>
  );
}
