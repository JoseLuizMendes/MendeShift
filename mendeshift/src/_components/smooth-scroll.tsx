"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onScrollToTop = () => lenis.scrollTo(0, { immediate: true });
    window.addEventListener("lenis:scrollToTop", onScrollToTop);

    // Garantir que os triggers calculem posições depois do Lenis entrar em ação.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", update);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      window.removeEventListener("lenis:scrollToTop", onScrollToTop);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
