"use client";

import { useTranslations } from "@/i18n/context";

/**
 * Skip-to-content link (WCAG 2.4.1). Oculto até receber foco pelo teclado.
 *
 * onClick faz preventDefault e foca o alvo diretamente: sem isso, o handler
 * global de âncoras do SmoothScroll (a[href^="#"]) intercepta o clique e só
 * rola a página — sem mover o foco do teclado, que é justamente o objetivo
 * do skip link. focus() já traz o alvo à viewport.
 */
export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main-content");
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-foreground focus:no-underline focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      {t("skip_to_content")}
    </a>
  );
}
