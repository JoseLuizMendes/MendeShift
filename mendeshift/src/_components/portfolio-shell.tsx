import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";
import { localeHref } from "@/lib/navigation";
import { FolderGlyph, TargetCorners } from "./folder-glyph";
import { LanguageToggle } from "./language-toggle";
import { PortfolioMobileMenu } from "./portfolio-mobile-menu";

export async function PortfolioHeader({ locale }: { locale: string }) {
  const [t, nav] = await Promise.all([
    getServerTranslations(locale, "portfolio"),
    getServerTranslations(locale, "nav"),
  ]);

  const links = (
    <div className="portfolio-nav-links">
      <Link className="portfolio-lab-link" href={localeHref("/ai-exploration", locale)} aria-label="Lab · AI Exploration">
        <span aria-hidden="true">✳</span><span>AI Exploration</span>
      </Link>
      <Link href={localeHref("/servicos", locale)}>{nav("services")}</Link>
      <Link href={localeHref("/blog", locale)}>{nav("blog")}</Link>
      <Link href={localeHref("/contato", locale)}>{nav("contact")}</Link>
      <LanguageToggle />
    </div>
  );
  const shortcuts = (
    <div className="portfolio-shortcuts">
      <Link className="portfolio-shortcut" href={localeHref("/projetos", locale)} aria-label={nav("projects")}>
        <TargetCorners /><FolderGlyph /><span>{nav("projects")}</span>
      </Link>
      <Link className="portfolio-shortcut" href={localeHref("/experience", locale)} aria-label={t("profile")}>
        <TargetCorners /><FolderGlyph /><span>{t("profile")}</span>
      </Link>
    </div>
  );

  return (
    <header className="portfolio-header">
      <div className="portfolio-frame portfolio-nav">
        <Link className="portfolio-brand font-display" href={localeHref("/", locale)} aria-label={nav("home") + " · MendeShift"}>
          MendeShift<span className="text-accent">.</span>
        </Link>
        <nav className="portfolio-desktop-navigation" aria-label={t("nav_label")}>
          {links}
          {shortcuts}
        </nav>
        <PortfolioMobileMenu title={t("nav_label")} closeLabel={locale === "pt" ? "Fechar" : "Close"}>
          {links}
          {shortcuts}
        </PortfolioMobileMenu>
      </div>
    </header>
  );
}
