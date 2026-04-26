import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerTranslations } from "@/i18n/server";

import { ColophonSection } from "@/_components/colophon-section";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";
import { getProjectBySlug, getProjectsByLocale } from "@/lib/projects";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  // Generate for both locales
  const locales = ["en", "pt"];
  return locales.flatMap((locale) =>
    getProjectsByLocale(locale).map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  return {
    title: `${project.title} | José Luiz Mendes`,
    description: project.shortDesc,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);

  if (!project) notFound();

  const t = await getServerTranslations(locale, "project_detail");

  const allProjects = getProjectsByLocale(locale);
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[currentIndex + 1] ?? null;

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="project-top" className="app-shell relative min-h-screen">
        {/* Header */}
        <section className="border-b border-border/20 pt-20 md:pt-28">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-2xl">
                <Eyebrow>
                  {project.category} / {project.slug}
                </Eyebrow>
                <SectionTitle className="mt-4">{project.title}</SectionTitle>
                <SectionLead>{project.shortDesc}</SectionLead>

                {project.metric && (
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    {project.metric}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <ActionLink href="/projetos" className="w-full justify-center sm:w-auto">
                  {t("all_projects")}
                </ActionLink>
                <ActionLink href="/" variant="ghost" className="w-full justify-center sm:w-auto">
                  {t("home")}
                </ActionLink>
              </div>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 pb-8 md:pb-10">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* Case Study */}
        <section className="py-20 md:py-28">
          <Container className="md:px-30">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CaseCard label={t("context")} content={project.context} />
              <CaseCard label={t("problem")} content={project.problem} />
              <CaseCard label={t("constraints")} content={project.constraints} />
            </div>

            {/* Solution — full width */}
            <Card className="mt-6 border-border/40 bg-card/60 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {t("solution")}
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
                {project.solution}
              </p>
            </Card>

            {/* Engineering Decisions */}
            <div className="mt-12">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {t("engineering")}
              </h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {project.engineeringDecisions.map((decision, idx) => (
                  <div key={idx} className="flex gap-4 border-l border-accent/40 pl-5">
                    <span className="shrink-0 font-mono text-[10px] text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {decision}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="mt-12">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {t("challenges")}
              </h3>
              <div className="mt-6 space-y-4">
                {project.challenges.map((challenge, idx) => (
                  <div key={idx} className="flex gap-4 border-l border-border/40 pl-5">
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {challenge}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome */}
            <Card className="mt-12 border-accent/30 bg-card/60 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {t("outcome")}
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-foreground/90">
                {project.outcome}
              </p>
            </Card>

            {/* Navigation */}
            <div className="mt-16 flex flex-col gap-4 border-t border-border/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <ActionLink href="/projetos" variant="ghost">
                {t("back")}
              </ActionLink>
              {nextProject && (
                <ActionLink href={`/projetos/${nextProject.slug}`}>
                  {t("next", { title: nextProject.title })}
                </ActionLink>
              )}
            </div>
          </Container>
        </section>

        <ColophonSection topHref="#project-top" />
      </main>
    </>
  );
}

function CaseCard({ label, content }: { label: string; content: string }) {
  return (
    <Card className="border-border/40 bg-card/60 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
        {content}
      </p>
    </Card>
  );
}
