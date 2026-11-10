import type { Metadata } from "next";
import { getServerTranslations } from "@/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { getProjectsByLocale } from "@/lib/projects";
import { PortfolioArchive } from "@/_components/portfolio-archive";
import { ColophonSection } from "@/_components/colophon-section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "portfolio");
  const meta = await getServerTranslations(locale, "meta");
  return pageMetadata({
    locale,
    path: "/projetos",
    title: meta("projects_title"),
    description: t("archive_intro"),
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "portfolio");
  const projects = getProjectsByLocale(locale).map(({ slug, title, category, tech, previewImage, previewImageAlt }) => ({
    slug, title, category, tech, previewImage, previewImageAlt,
  }));

  return (
    <main id="projects-top" className="app-shell min-h-screen">
      <PortfolioArchive
        projects={projects}
        locale={locale}
        title={t("archive_title")}
        intro={t("archive_intro")}
        count={t("folder_count", { count: projects.length })}
      />
      <ColophonSection />
    </main>
  );
}
