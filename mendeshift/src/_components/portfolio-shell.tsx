import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";
import { localeHref } from "@/lib/navigation";
import { FolderGlyph, TargetCorners } from "./folder-glyph";
import { LanguageToggle } from "./language-toggle";

export async function PortfolioHeader({ locale }: { locale: string }) {
  const [t, nav] = await Promise.all([
    getServerTranslations(locale, "portfolio"),
    getServerTranslations(locale, "nav"),
  ]);

  return (
    <header className="portfolio-header">
      <nav className="portfolio-frame portfolio-nav" aria-label={t("nav_label")}>
        <Link className="portfolio-brand font-display" href={localeHref("/", locale)} aria-label={nav("home") + " · MendeShift"}>
          MendeShift<span className="text-accent">.</span>
        </Link>
        <div className="portfolio-nav-links">
          <Link className="portfolio-lab-link" href={localeHref("/ai-exploration", locale)}>
            <span aria-hidden="true">✳</span> AI Exploration
          </Link>
          <Link href={localeHref("/servicos", locale)}>{nav("services")}</Link>
          <Link href={localeHref("/blog", locale)}>{nav("blog")}</Link>
          <Link href={localeHref("/contato", locale)}>{nav("contact")}</Link>
          <LanguageToggle />
        </div>
        <div className="portfolio-shortcuts">
          <Link className="portfolio-shortcut" href={localeHref("/projetos", locale)} aria-label={nav("projects")}>
            <TargetCorners /><FolderGlyph /><span>./works</span>
          </Link>
          <Link className="portfolio-shortcut" href={localeHref("/experience", locale)} aria-label={t("profile")}>
            <TargetCorners /><FolderGlyph /><span>./profile</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
