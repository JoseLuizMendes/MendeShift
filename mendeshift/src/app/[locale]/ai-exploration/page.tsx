import type { Metadata } from "next";
import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { localeHref } from "@/lib/navigation";
import { ColophonSection } from "@/_components/colophon-section";
import { ShaderImage } from "@/_components/shader-image";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "portfolio");
  return pageMetadata({
    locale,
    path: "/ai-exploration",
    title: "AI Exploration | MendeShift",
    description: t("lab_intro"),
  });
}

export default async function AiExplorationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "portfolio");

  return (
    <main className="app-shell min-h-screen">
      <div className="portfolio-frame portfolio-lab">
        <header className="portfolio-lab-intro">
          <div>
            <p className="portfolio-mono text-accent">R&amp;D / ./lab</p>
            <h1 className="portfolio-display">AI Exploration<span className="text-accent">.</span></h1>
          </div>
          <p className="portfolio-lead">{t("lab_intro")}</p>
        </header>

        <nav className="portfolio-lab-tabs portfolio-mono" aria-label={t("lab_nav")}>
          <a href="#graphite">01 / {t("hero_study")} ↓</a>
          <a href="#signal">02 / {t("project_study")} ↓</a>
          <a href="#wardrobe">03 / {t("lab_wardrobe")} ↓</a>
        </nav>

        <section id="graphite" className="portfolio-study">
          <ShaderImage className="portfolio-study-art" src="/portfolio/hero.webp" alt="" position={0.72} sizes="(max-width: 760px) 100vw, 62vw" priority />
          <div className="portfolio-study-copy">
            <p className="portfolio-mono text-accent">01 / WEBGL</p>
            <h2 className="portfolio-display">{t("hero_study")}</h2>
            <p className="portfolio-lead">{t("hero_study_body")}</p>
            <p className="portfolio-lead mt-3">{t("lab_graphite_note")}</p>
            <Link className="portfolio-text-link mt-4" href={localeHref("/#hero", locale)}>{t("lab_open_home")} ↗</Link>
          </div>
        </section>

        <section id="signal" className="portfolio-study">
          <ShaderImage className="portfolio-study-art" src="/portfolio/agendamento-api.webp" alt="" sizes="(max-width: 760px) 100vw, 62vw" />
          <div className="portfolio-study-copy">
            <p className="portfolio-mono text-accent">02 / WEBGL</p>
            <h2 className="portfolio-display">{t("project_study")}</h2>
            <p className="portfolio-lead">{t("project_study_body")}</p>
            <p className="portfolio-lead mt-3">{t("lab_signal_note")}</p>
          </div>
        </section>
        <section id="wardrobe" className="my-8 grid gap-4 border-t border-border/60 py-8 sm:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="portfolio-mono text-accent">03 / WEBGL</p>
            <h2 className="portfolio-display text-4xl sm:text-5xl">{t("lab_wardrobe")}</h2>
          </div>
          <div>
            <p className="portfolio-lead">{t("lab_wardrobe_note")}</p>
            <Link className="portfolio-text-link mt-4" href={localeHref("/#about", locale)}>{t("lab_open_studio")} ↗</Link>
          </div>
        </section>
      </div>
      <ColophonSection />
    </main>
  );
}
