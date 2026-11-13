import type { Metadata } from "next";
import { getServerTranslations } from "@/i18n/server";

import { getExperienceByLocale } from "@/lib/experience";
import { pageMetadata } from "@/lib/metadata";
import { ColophonSection } from "@/_components/colophon-section";
import { ExperienceSection } from "@/_components/experience-section";
import { Button } from "@/_components/ui/button";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  return pageMetadata({
    locale,
    path: "/experience",
    title: t("experience_title"),
    description: t("experience_desc"),
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "experience_page");
  const { experienceAchievements, ...experienceData } = getExperienceByLocale(locale);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="experience-page-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-10 sm:pt-12 md:pt-8">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-2xl">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <h1 className="portfolio-display mt-4">{t("title")}</h1>
                <SectionLead>{t("lead")}</SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                {/* Locale explícito: o redirect "/"→"/{locale}" descarta o #hash */}
                <Button href="/#work" className="w-full justify-center sm:w-auto">
                  {t("view_projects")}
                </Button>
                <BackToHomeLink variant="secondary" className="w-full justify-center sm:w-auto">
                  {t("back")}
                </BackToHomeLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-border/30 py-10 md:py-14">
          <Container>
            <h2 className="font-display text-3xl md:text-4xl">{t("highlights")}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {experienceAchievements.slice(0, 2).map((item) => (
                <article key={item.label} className="border-t border-border/60 pt-4">
                  <p className="portfolio-mono text-accent">{item.label}</p>
                  <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <ExperienceSection {...experienceData} />
        <ColophonSection />
      </main>
    </>
  );
}
