"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "@/i18n/context";
import { localeHref } from "@/lib/navigation";
import { PortfolioCta } from "./portfolio-cta";
import { Container } from "./ui/container";

const pages = [
  { label: "profile", href: "/#about" },
  { label: "services", href: "/servicos" },
  { label: "projects", href: "/projetos" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contato" },
] as const;

const contacts = [
  { label: "Email", href: "mailto:josemendess004@gmail.com" },
  { label: "GitHub", href: "https://github.com/JoseLuizMendes" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jos%C3%A9-luiz-dos-santos-azeredo-mendes/" },
  { label: "Instagram", href: "https://www.instagram.com/mendeshift" },
  { label: "TikTok", href: "https://www.tiktok.com/@mendeshift" },
] as const;

export function ColophonSection() {
  const t = useTranslations("colophon");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const linkClass = "inline-flex min-h-11 items-center transition-colors interaction-motion hover:text-accent focus-visible:text-accent sm:min-h-8";

  return (
    <footer id="colophon" className="border-t border-border/40">
      <Container className="md:px-20">
        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-[minmax(0,1.4fr)_1fr_1fr] md:py-14">
          <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
            <Link href={localeHref("/", locale)} className="font-display text-5xl leading-none tracking-tight">
              MendeShift<span className="text-accent">.</span>
            </Link>
            <PortfolioCta href="/contato" label={t("cta_project")} />
          </div>
          <nav aria-label={t("pages_label")} className="portfolio-mono">
            <p className="mb-2 text-muted-foreground">{t("pages_label")}</p>
            <ul>
              {pages.map(({ label, href }) => (
                <li key={href}><Link href={localeHref(href, locale)} className={linkClass}>{nav(label)}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("follow_label")} className="portfolio-mono">
            <p className="mb-2 text-muted-foreground">{t("follow_label")}</p>
            <ul>
              {contacts.map(({ label, href }) => (
                <li key={href}><a href={href} className={linkClass}>{label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-t border-border/40 py-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
