import Link from "next/link";
import { localeHref } from "@/lib/navigation";
import type { Project } from "@/lib/projects";
import { FolderGlyph, TargetCorners } from "./folder-glyph";

export type DirectoryProject = Pick<Project, "slug" | "title" | "category" | "shortDesc" | "tech" | "previewImage" | "previewImageAlt">;

export function PortfolioDirectory({
  projects,
  locale,
  activeSlug,
  onPreview,
  nameAs: Name = "h3",
}: {
  projects: DirectoryProject[];
  locale: string;
  activeSlug?: string;
  onPreview: (slug: string) => void;
  /** Nível do heading de cada projeto: um abaixo do título da seção. */
  nameAs?: "h2" | "h3";
}) {
  return (
    <ul className="portfolio-directory">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link
            className="directory-entry"
            data-project={project.slug}
            href={localeHref(`/projetos/${project.slug}`, locale)}
            data-previewed={activeSlug === project.slug ? "" : undefined}
            onPointerEnter={() => onPreview(project.slug)}
            onFocus={() => onPreview(project.slug)}
          >
            <span className="directory-icon">
              <TargetCorners />
              <span aria-hidden="true" className="directory-number portfolio-mono">{String(index + 1).padStart(2, "0")}</span>
              <FolderGlyph />
            </span>
            <Name className="directory-name portfolio-mono">{project.title}</Name>
            <span className="directory-category portfolio-mono">{project.category}</span>
            <span className="directory-description">{project.shortDesc}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
