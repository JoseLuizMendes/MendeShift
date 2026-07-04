"use client";

import type React from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SCROLL_KEY_PREFIX } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

// Home com ou sem prefixo de locale ("/", "/pt", "/en")
const HOME_RE = /^\/(pt|en)?$/;

// Roda antes do paint no cliente; useEffect no servidor evita warning de SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isPopState = useRef(false);
  const prevPathnameRef = useRef<string | null>(null);
  // Última posição real de scroll ANTES da navegação. Atualizada só pelo
  // evento de scroll do Lenis (rAF), então o reset-para-topo que o Next
  // aplica durante o commit nunca a sobrescreve antes de salvarmos.
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    // Controle total: sem isso a restauração nativa do browser briga com
    // Lenis + ScrollTrigger e o usuário aterrissa na seção errada.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const onScroll = () => {
      lastScrollYRef.current = Math.round(window.scrollY);
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onScrollToTop = () => lenis.scrollTo(0, { immediate: true });
    window.addEventListener("lenis:scrollToTop", onScrollToTop);

    // Scroll suave até uma seção, sempre via Lenis (scrollIntoView nativo
    // briga com o rAF do Lenis e produz jank).
    const onScrollToSection = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const element = document.getElementById(id);
      if (element) lenis.scrollTo(element, {});
    };
    window.addEventListener("lenis:scrollTo", onScrollToSection);

    // Âncoras da mesma página (hero → #services, colophon → #hero) rolam
    // suave via Lenis em vez do salto nativo. Não usamos o `anchors: true`
    // do Lenis porque ele intercepta também links cross-route ("/pt#work")
    // e falha ("Target not found") antes de a navegação acontecer.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const element = id ? document.getElementById(id) : null;
      if (!element) return;
      event.preventDefault();
      window.history.replaceState(null, "", `#${id}`);
      lenis.scrollTo(element, {});
    };
    document.addEventListener("click", onAnchorClick);

    const onPopState = () => {
      isPopState.current = true;
      // O Next devolve isto para "auto"; reforçar AQUI reduz a chance de o
      // Chrome disparar a própria restauração por cima da nossa.
      window.history.scrollRestoration = "manual";
    };
    window.addEventListener("popstate", onPopState);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.history.scrollRestoration = previousRestoration;
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      window.removeEventListener("lenis:scrollToTop", onScrollToTop);
      window.removeEventListener("lenis:scrollTo", onScrollToSection);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Re-execução sem mudança de rota (StrictMode/HMR remonta o efeito):
    // não salvar nem rolar — senão o branch final zera o scroll do nada.
    if (prev === pathname) return;

    // Salva a posição da rota que estamos deixando (qualquer rota).
    if (prev !== null) {
      sessionStorage.setItem(
        SCROLL_KEY_PREFIX + prev,
        String(lastScrollYRef.current),
      );
    }

    const isGoingHome = HOME_RE.test(pathname);
    const cameFromSubPage = prev !== null && !HOME_RE.test(prev);
    const wasPopState = isPopState.current;
    isPopState.current = false;


    // Back/forward do navegador: restaura a posição exata da rota destino.
    // Push para a home vindo de subpágina (fallback do BackToHomeLink):
    // também restaura, para o "voltar" devolver o usuário onde ele estava.
    // O Next pode devolver isto para "auto" em navegações; reforça.
    window.history.scrollRestoration = "manual";

    if (wasPopState || (isGoingHome && cameFromSubPage && !window.location.hash)) {
      return restoreScroll(pathname, lenisRef, lastScrollYRef);
    }

    const hash = window.location.hash;
    if (hash) {
      return scrollToHashWhenReady(hash, lenisRef);
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    lastScrollYRef.current = 0;
  }, [pathname]);

  return <>{children}</>;
}

/**
 * Restaura a posição salva de forma INSTANTÂNEA (nunca animada).
 * Animar a restauração abre uma janela em que os ScrollTriggers reagem ao
 * trajeto do scroll e colapsam seções — era a causa do usuário "cair" no
 * CTA/chat ao voltar de um case. Aplica duas vezes (síncrono + rAF) para
 * vencer qualquer reset-para-topo tardio do Next, e recalcula os triggers.
 */
function restoreScroll(
  pathname: string,
  lenisRef: React.RefObject<Lenis | null>,
  lastScrollYRef: React.RefObject<number>,
) {
  const saved = sessionStorage.getItem(SCROLL_KEY_PREFIX + pathname);
  const pos = saved !== null ? Math.max(0, Number(saved) || 0) : 0;

  const apply = () => {
    const lenis = lenisRef.current;
    if (lenis) {
      // As dimensões internas do Lenis podem estar defasadas logo após o
      // commit (página ainda "curta" no cache dele) — sem resize() o
      // scrollTo é clampado ao limite antigo e o estado interno fica
      // dessincronizado da janela (primeiro wheel saltava para trás).
      lenis.resize();
      lenis.scrollTo(pos, { immediate: true, force: true });
    } else {
      window.scrollTo(0, pos);
    }
    lastScrollYRef.current = pos;
  };

  if (pos === 0) {
    apply();
    return;
  }

  // Logo após o commit a página pode ainda estar "baixa" (payload da rota
  // sendo buscado/renderizado). Um scrollTo cedo demais seria clampado e
  // deixaria o Lenis "arrastando" até o alvo enquanto a página cresce —
  // por isso só aplica quando houver altura suficiente (1ª checagem é
  // síncrona: conteúdo pronto = restaura antes do paint).
  let attempts = 0;
  let rafId = 0;
  let cancelled = false;

  // Depois de aplicar, "fixa" a posição por alguns frames: a restauração
  // nativa do browser (o Next devolve scrollRestoration a "auto") pode
  // disparar DEPOIS da nossa e dessincronizar o Lenis — aí o primeiro
  // wheel do usuário saltava a página para o valor interno defasado.
  // Re-aplicar re-sincroniza; aborta na hora se o usuário começar a rolar.
  const startPinning = () => {
    const pinUntil = performance.now() + 450;
    const stopPin = () => { cancelled = true; };
    window.addEventListener("wheel", stopPin, { once: true, passive: true });
    window.addEventListener("touchstart", stopPin, { once: true, passive: true });

    const pin = () => {
      if (cancelled) return;
      // Confere a janela E o estado interno do Lenis — a restauração
      // nativa tardia pode mover só um dos dois.
      const internal = lenisRef.current
        ? lenisRef.current.animatedScroll
        : window.scrollY;
      if (
        Math.abs(window.scrollY - pos) > 2 ||
        Math.abs(internal - pos) > 2
      ) {
        apply();
      }
      if (performance.now() < pinUntil) {
        rafId = requestAnimationFrame(pin);
      }
    };
    rafId = requestAnimationFrame(pin);
  };

  const tryRestore = () => {
    if (cancelled) return;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll >= pos || attempts >= 60) {
      apply();
      ScrollTrigger.refresh();
      startPinning();
      return;
    }
    attempts++;
    rafId = requestAnimationFrame(tryRestore);
  };

  tryRestore();
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

/**
 * Rola até a âncora assim que o elemento existir no DOM (retry via rAF,
 * ~1s no máximo), em vez de um timeout fixo que falha em páginas pesadas.
 */
function scrollToHashWhenReady(
  hash: string,
  lenisRef: React.RefObject<Lenis | null>,
) {
  let attempts = 0;
  let rafId = 0;

  const tryScroll = () => {
    let target: Element | null = null;
    try {
      target = document.querySelector(hash);
    } catch {
      return; // hash inválido como seletor
    }

    if (target) {
      // Alvo como NÚMERO absoluto a partir de window.scrollY (fonte da
      // verdade) e `immediate`: logo após a navegação o scroll interno do
      // Lenis pode estar dessincronizado do salto nativo de hash do Next —
      // um scrollTo(elemento) animado aqui compõe alvos errados e "desce
      // sozinho" até outra seção.
      const top = Math.round(
        target.getBoundingClientRect().top + window.scrollY,
      );
      lenisRef.current?.scrollTo(top, { immediate: true, force: true });
      ScrollTrigger.refresh();
      return;
    }
    if (attempts++ < 60) rafId = requestAnimationFrame(tryScroll);
  };

  tryScroll();
  return () => cancelAnimationFrame(rafId);
}
