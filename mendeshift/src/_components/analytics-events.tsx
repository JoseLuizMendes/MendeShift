"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

import { rememberUtm } from "@/lib/utm";

/**
 * Eventos de conversão que acontecem em links espalhados pelo site.
 *
 * Um único listener delegado cobre todos os botões de WhatsApp, e-mail e
 * "pedir proposta" — sem precisar instrumentar cada componente (vários são
 * de servidor). Os eventos de formulário e chat são disparados nos próprios
 * componentes: `lead_submitted`, `chat_opened`, `chat_message_sent`.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    rememberUtm();

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const path = window.location.pathname;

      if (href.includes("wa.me/")) {
        track("whatsapp_click", { path });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { path });
      } else if (/\/contato(#.*)?$/.test(href) && !path.endsWith("/contato")) {
        track("briefing_cta_click", { path });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
