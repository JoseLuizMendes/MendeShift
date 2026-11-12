import Image from "next/image";
import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";
import { localeHref } from "@/lib/navigation";
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
  const featured = projects.find((project) => project.slug === "wedding-platform");

  return (
    <section id="work" className="border-t border-border/30">
      {featured?.previewImage && (
        <div className="portfolio-frame pt-10 md:pt-16">
          <Link href={localeHref(`/projetos/${featured.slug}`, locale)} className="featured-case group">
            <div className="featured-case-copy">
              <p className="portfolio-mono text-accent">{portfolio("featured_case")}</p>
              <h2 className="portfolio-display">{featured.title}</h2>
              <p className="portfolio-lead">{featured.shortDesc}</p>
              <span className="portfolio-text-link">{portfolio("view_case")} ↗</span>
            </div>
            <Image
              src={featured.previewImage}
              alt={featured.previewImageAlt ?? ""}
              width={6536}
              height={4357}
              sizes="(max-width: 760px) 100vw, 62vw"
              quality={90}
            />
          </Link>
        </div>
      )}
      <PortfolioArchive
        projects={projects.map(({ slug, title, category, shortDesc, tech, previewImage, previewImageAlt }) => ({
          slug, title, category, shortDesc, tech, previewImage, previewImageAlt,
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
