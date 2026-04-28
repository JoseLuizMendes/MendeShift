import type { Metadata } from "next";
import { getServerTranslations } from "@/i18n/server";

import { getExperienceByLocale } from "@/lib/experience";
import { ColophonSection } from "@/_components/colophon-section";
import { ExperienceSection } from "@/_components/experience-section";
import { ActionLink } from "@/_components/ui/action-link";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  return {
    title: t("experience_title"),
    description: t("experience_desc"),
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "experience_page");
  const experienceData = getExperienceByLocale(locale);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="experience-page-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-10 sm:pt-12 md:pt-8">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-2xl">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <SectionTitle className="mt-4">{t("title")}</SectionTitle>
                <SectionLead>{t("lead")}</SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <ActionLink href="/#work" className="w-full justify-center sm:w-auto">
                  {t("view_projects")}
                </ActionLink>
                <BackToHomeLink variant="ghost" className="w-full justify-center sm:w-auto">
                  {t("back")}
                </BackToHomeLink>
              </div>
            </div>
          </Container>
        </section>

        <ExperienceSection {...experienceData} />
        <ColophonSection topHref="#experience-page-top" />
      </main>
    </>
  );
}
