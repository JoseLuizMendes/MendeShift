"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { localeHref } from "@/lib/navigation";
import { TargetCorners } from "./folder-glyph";
import { PortfolioDirectory, type DirectoryProject } from "./portfolio-directory";

export function PortfolioArchive({
  projects,
  locale,
  title,
  intro,
  count,
  archiveLink,
}: {
  projects: DirectoryProject[];
  locale: string;
  title: string;
  intro: string;
  count: string;
  archiveLink?: string;
}) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug);
  const active = projects.find((project) => project.slug === activeSlug) ?? projects[0];
  const Heading = archiveLink ? "h2" : "h1";

  return (
    <div className="portfolio-frame portfolio-archive">
      <header className="portfolio-archive-intro">
        <p className="portfolio-mono text-accent">INDEX / ./works</p>
        <Heading className="portfolio-display">{title}<span className="text-accent">.</span></Heading>
        <p className="portfolio-lead">{intro}</p>
        {archiveLink && (
          <Link className="portfolio-text-link" href={localeHref("/projetos", locale)}>{archiveLink} ↗</Link>
        )}

        {active && (
          <figure className="portfolio-archive-preview">
            <figcaption>
              <p className="portfolio-mono">{active.title} <span>· {active.category}</span></p>
              <p>{active.tech.join(" / ")}</p>
            </figcaption>
            <div className="portfolio-preview-image">
              {projects.map((project) => project.previewImage && (
                <Image
                  key={project.slug}
                  src={project.previewImage}
                  alt={project.slug === active.slug ? project.previewImageAlt ?? "" : ""}
                  aria-hidden={project.slug !== active.slug}
                  data-visible={project.slug === active.slug ? "" : undefined}
                  sizes="(max-width: 760px) 100vw, 28vw"
                  quality={90}
                  fill
                />
              ))}
            </div>
          </figure>
        )}
      </header>
      <section className="portfolio-archive-files" aria-label={title}>
        <TargetCorners />
        <PortfolioDirectory projects={projects} locale={locale} activeSlug={active?.slug} onPreview={setActiveSlug} nameAs={archiveLink ? "h3" : "h2"} />
        <div className="portfolio-archive-bar portfolio-mono">
          <span>~/mendeshift/works</span>
          <span>{count}</span>
        </div>
      </section>
    </div>
  );
}
