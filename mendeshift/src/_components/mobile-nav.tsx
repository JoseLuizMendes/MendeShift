"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useTranslations } from "@/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Navegação mobile (< md). A side-nav desktop é `hidden md:flex`, então no
 * celular o usuário ficava sem nenhuma navegação entre páginas. Este menu
 * cobre esse buraco: um botão hamburguer fixo abre um overlay fullscreen
 * com links para as rotas reais do estúdio + a troca de idioma (que no
 * mobile sai do toggle flutuante para não sobrepor conteúdo).
 *
 * Server components/CSS transitions por padrão — sem GSAP (guardrail de
 * performance): a abertura é só uma transição de opacidade/translate.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha ao trocar de rota (ex.: back/forward com o menu aberto).
  // Ajuste de estado durante o render (padrão dos docs do React) em vez
  // de setState num efeito, que dispara render em cascata.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Rotas reais — funcionam de qualquer página (diferente das âncoras da
  // side-nav desktop, que só existem na home).
  const links = [
    { label: t("home"), href: `/${locale}` },
    { label: t("profile"), href: `/${locale}/experience` },
    { label: t("services"), href: `/${locale}/servicos` },
    { label: t("projects"), href: `/${locale}/projetos` },
    { label: t("contact"), href: `/${locale}/contato` },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const targetLocale = locale === "en" ? "pt" : "en";
  const switchLanguage = () => {
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const newPath =
      locale === "pt" ? pathname.replace(/^\/pt/, "") || "/" : `/pt${pathname}`;
    window.location.href = newPath;
  };

  return (
    <div className="md:hidden">
      {/* Botão hamburguer — fixo, mesma linguagem visual do toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className={cn(
          "fixed right-4 top-4 z-[70] flex h-11 w-11 items-center justify-center",
          "rounded-full border border-border/50 bg-background/80 backdrop-blur-sm",
          "transition-colors duration-300 hover:border-accent/60",
        )}
      >
        <span className="relative flex h-4 w-5 flex-col justify-between">
          <span
            className={cn(
              "h-px w-full origin-center bg-foreground transition-all duration-300",
              open && "translate-y-[7px] rotate-45 bg-accent",
            )}
          />
          <span
            className={cn(
              "h-px w-full bg-foreground transition-all duration-300",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "h-px w-full origin-center bg-foreground transition-all duration-300",
              open && "-translate-y-[7px] -rotate-45 bg-accent",
            )}
          />
        </span>
      </button>

      {/* Overlay fullscreen */}
      <nav
        aria-hidden={!open}
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-[65] flex flex-col justify-center gap-2 bg-background px-8",
          "transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute left-8 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          MendeShift
        </div>

        <ul className="flex flex-col gap-1">
          {links.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block py-2 font-display text-4xl tracking-tight text-foreground",
                  "transition-all duration-500 hover:text-accent",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Troca de idioma dentro do menu (substitui o toggle flutuante no mobile) */}
        <button
          type="button"
          onClick={switchLanguage}
          className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-accent"
        >
          <span className="text-muted-foreground/80">{locale.toUpperCase()}</span>
          <span className="text-muted-foreground/80">/</span>
          <span>{targetLocale.toUpperCase()}</span>
        </button>
      </nav>
    </div>
  );
}
