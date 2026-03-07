import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ColophonSection } from "@/_components/colophon-section";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";
import { getProjectBySlug, projects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | José Luiz Mendes`,
    description: project.shortDesc,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[currentIndex + 1] ?? null;

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

              <div className="flex flex-wrap gap-3">
                <ActionLink href="/#work">← Ver todos os projetos</ActionLink>
                <ActionLink href="/" variant="ghost">
                  Home
                </ActionLink>
              </div>
            </div>

            {/* Tech stack */}
            <div className="pb-10 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* Case Study */}
        <section className="py-20 md:py-28">
          <Container className="md:px-30">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Context */}
              <CaseCard label="Contexto" content={project.context} />

              {/* Problem */}
              <CaseCard label="Problema" content={project.problem} />

              {/* Constraints */}
              <CaseCard label="Restrições" content={project.constraints} />
            </div>

            {/* Solution — full width */}
            <Card className="mt-6 border-border/40 bg-card/60 p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Solução
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
                {project.solution}
              </p>
            </Card>

            {/* Engineering Decisions */}
            <div className="mt-12">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Decisões de Engenharia
              </h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {project.engineeringDecisions.map((decision, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border-l border-accent/40 pl-5"
                  >
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
                Desafios
              </h3>
              <div className="mt-6 space-y-4">
                {project.challenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border-l border-border/40 pl-5"
                  >
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
            <Card className="mt-12 border-accent/30 bg-card/60 p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Resultado
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-foreground/90">
                {project.outcome}
              </p>
            </Card>

            {/* Navigation */}
            <div className="mt-16 flex flex-col gap-4 border-t border-border/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <ActionLink href="/#work" variant="ghost">
                ← Voltar para projetos
              </ActionLink>
              {nextProject && (
                <ActionLink href={`/projetos/${nextProject.slug}`}>
                  Próximo: {nextProject.title} →
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
