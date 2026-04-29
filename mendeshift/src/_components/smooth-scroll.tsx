"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HOME_RE = /^\/(pt|en)$/;
const SESSION_KEY = "mendeshift:home-scroll";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isPopState = useRef(false);
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onScrollToTop = () => lenis.scrollTo(0, { immediate: true });
    window.addEventListener("lenis:scrollToTop", onScrollToTop);

    const onPopState = () => { isPopState.current = true; };
    window.addEventListener("popstate", onPopState);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      window.removeEventListener("lenis:scrollToTop", onScrollToTop);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const isGoingHome = HOME_RE.test(pathname);
    const wasOnHome = prev !== null && HOME_RE.test(prev);
    const cameFromSubPage = prev !== null && !HOME_RE.test(prev);

    // Saindo de home → salva window.scrollY (fonte de verdade mais direta)
    if (wasOnHome && !isGoingHome) {
      const pos = Math.round(window.scrollY);
      sessionStorage.setItem(SESSION_KEY, String(pos));
    }

    if (isPopState.current) {
      isPopState.current = false;
      if (isGoingHome) {
        restoreHomeScroll(lenisRef);
        return;
      }
      // Outros back/forward: browser restaura
      return;
    }

    const hash = window.location.hash;
    if (hash) {
      const id = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) lenisRef.current?.scrollTo(target as HTMLElement, { immediate: false });
      }, 80);
      return () => clearTimeout(id);
    }

    if (isGoingHome && cameFromSubPage) {
      restoreHomeScroll(lenisRef);
      return;
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}

function restoreHomeScroll(lenisRef: React.RefObject<Lenis | null>) {
  const saved = sessionStorage.getItem(SESSION_KEY);
  const pos = saved !== null ? Number(saved) : 0;

  if (pos > 0) {
    const id = setTimeout(() => {
      lenisRef.current?.scrollTo(pos, { immediate: false, duration: 0.9 });
    }, 120);
    // Retorna cleanup — mas como estamos em função auxiliar, o timeout
    // pode ficar sem cleanup nesse caso (aceitável, é uma única operação)
    return id;
  } else {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }
}
