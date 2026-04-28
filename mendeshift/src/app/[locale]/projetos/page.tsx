import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ColophonSection } from "@/_components/colophon-section";
import { ActionLink } from "@/_components/ui/action-link";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";
import { getProjectsByLocale, type Project } from "@/lib/projects";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  return {
    title: t("projects_title"),
    description: t("projects_desc"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "projects_page");
  const projects = getProjectsByLocale(locale);

  const leftColumn = projects.filter((_, index) => index % 2 === 0);
  const rightColumn = projects.filter((_, index) => index % 2 === 1);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="projects-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-10 sm:pt-12 md:pt-8">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-3xl">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <SectionTitle className="mt-4">{t("title")}</SectionTitle>
                <SectionLead>{t("lead")}</SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <BackToHomeLink className="w-full justify-center sm:w-auto">
                  {t("back")}
                </BackToHomeLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container className="md:px-30">
            {/* Desktop — continuous scroll columns */}
            <div className="hidden gap-6 lg:grid lg:grid-cols-2">
              <ProjectsColumn items={leftColumn} direction="up" openCaseLabel={t("open_case")} />
              <ProjectsColumn items={rightColumn} direction="down" openCaseLabel={t("open_case")} />
            </div>

            {/* Mobile / Tablet — stacked cards */}
            <div className="grid gap-5 lg:hidden">
              {projects.map((project, index) => (
                <ProjectArchiveCard
                  key={project.slug}
                  project={project}
                  index={index}
                  openCaseLabel={t("open_case")}
                  priority={index === 0}
                />
              ))}
            </div>
          </Container>
        </section>

        <ColophonSection topHref="#projects-top" />
      </main>
    </>
  );
}

function ProjectsColumn({
  items,
  direction,
  openCaseLabel,
}: {
  items: ReturnType<typeof getProjectsByLocale>;
  direction: "up" | "down";
  openCaseLabel: string;
}) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="relative h-[900px] overflow-hidden rounded-[calc(var(--radius)+4px)] border border-border/25 bg-card/20 px-3 pb-3">
      <div
        className={`projects-column ${direction === "up" ? "projects-column-up" : "projects-column-down"}`}
      >
        {repeatedItems.map((project, index) => (
          <ProjectArchiveCard
            key={`${project.slug}-${index}`}
            project={project}
            index={index % items.length}
            openCaseLabel={openCaseLabel}
            priority={direction === "up" && index === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectArchiveCard({
  project,
  index,
  openCaseLabel,
  priority = false,
}: {
  project: Omit<Project, "pt">;
  index: number;
  openCaseLabel: string;
  priority?: boolean;
}) {
  return (
    <article className="group">
      <Card className="overflow-hidden border-border/35 bg-card/75 p-0 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/55">
        {/* Preview — image flush to top */}
        <div
          className={`relative aspect-video w-full overflow-hidden ${!project.previewImage ? project.accentGradient : "bg-card/30"}`}
        >
          {project.previewImage && (
            <Image
              src={project.previewImage}
              alt=""
              fill
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale brightness-[0.32]"
              style={{
                objectPosition:
                  project.previewImageFocusArchive ??
                  project.previewImageFocus ??
                  "center",
              }}
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-b from-background/25 via-background/50 to-background/88" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_55%)]" />

          <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
            <span>{project.placeholderLabel}</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>

          <div className="absolute inset-x-4 bottom-4">
            <p className="max-w-[28ch] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/85">
              {project.placeholderCaption}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {project.category}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {project.metric}
              </span>
            </div>
            <h2 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
              {project.title}
            </h2>
          </div>

          <p className="mt-3 w-full font-mono text-xs leading-relaxed text-muted-foreground">
            {project.shortDesc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/75"
              >
                {tech}
              </span>
            ))}
          </div>

          <Link
            href={`/projetos/${project.slug}`}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 group-hover:text-accent"
          >
            {openCaseLabel}
            <BitmapChevron className="w-3 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
      </Card>
    </article>
  );
}
