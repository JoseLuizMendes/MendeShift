import { getServerTranslations } from "@/i18n/server";
import type { Project } from "@/lib/projects";
import { PortfolioArchive } from "./portfolio-archive";

export async function WorkSection({
  projects,
  locale,
}: {
  projects: Omit<Project, "pt">[];
  locale: string;
}) {
  const [work, portfolio] = await Promise.all([
    getServerTranslations(locale, "work"),
    getServerTranslations(locale, "portfolio"),
  ]);

  return (
    <section id="work" className="border-t border-border/30">
      <PortfolioArchive
        projects={projects.map(({ slug, title, category, tech, previewImage, previewImageAlt }) => ({
          slug, title, category, tech, previewImage, previewImageAlt,
        }))}
        locale={locale}
        title={work("title")}
        intro={portfolio("archive_intro")}
        count={portfolio("folder_count", { count: projects.length })}
        archiveLink={work("explore")}
      />
    </section>
  );
}
