"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  // Flag set by popstate so we know browser back/forward triggered the nav
  const isPopState = useRef(false);

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

    // Detect browser back/forward so we don't override restored scroll
    const onPopState = () => { isPopState.current = true; };
    window.addEventListener("popstate", onPopState);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", update);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      window.removeEventListener("lenis:scrollToTop", onScrollToTop);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
    };
  }, []);

  // Handle scroll position on every client-side navigation
  useEffect(() => {
    // Skip on initial mount — preloader / hard load handles that
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Browser back/forward: let the browser restore scroll naturally
    if (isPopState.current) {
      isPopState.current = false;
      return;
    }

    const hash = window.location.hash;

    if (hash) {
      // Navigate to a hash anchor (e.g. /#work)
      const id = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenisRef.current?.scrollTo(target as HTMLElement, { immediate: false });
        }
      }, 80);
      return () => clearTimeout(id);
    } else {
      // Plain page navigation — always start at top
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
