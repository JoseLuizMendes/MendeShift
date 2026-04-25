import type { Metadata } from "next";
import Image from "next/image";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ColophonSection } from "@/_components/colophon-section";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos | José Luiz Mendes",
  description:
    "Arquivo de projetos com foco em arquitetura, execução e entrega em produção.",
};

const leftColumn = projects.filter((_, index) => index % 2 === 0);
const rightColumn = projects.filter((_, index) => index % 2 === 1);

export default function ProjectsPage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="projects-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-20 md:pt-28">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-3xl">
                <Eyebrow>Arquivo / Projetos</Eyebrow>
                <SectionTitle className="mt-4">Projetos em fluxo contínuo</SectionTitle>
                <SectionLead>
                  Uma leitura mais editorial do portfólio: duas colunas em ritmos opostos,
                  com contexto visual antes de entrar em cada case.
                </SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <ActionLink href="/#work" className="w-full justify-center sm:w-auto">
                  ← Voltar para home
                </ActionLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container className="md:px-30">
            {/* Desktop — colunas em scroll contínuo */}
            <div className="hidden gap-6 lg:grid lg:grid-cols-2">
              <ProjectsColumn items={leftColumn} direction="up" />
              <ProjectsColumn items={rightColumn} direction="down" />
            </div>

            {/* Mobile / Tablet — cards empilhados */}
            <div className="grid gap-5 lg:hidden">
              {projects.map((project, index) => (
                <ProjectArchiveCard key={project.slug} project={project} index={index} />
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
}: {
  items: typeof projects;
  direction: "up" | "down";
}) {
  const repeatedItems = [...items, ...items];

  return (
    // sem padding no topo — primeiro card rente à borda do container
    <div className="relative h-[900px] overflow-hidden rounded-[calc(var(--radius)+4px)] border border-border/25 bg-card/20 px-3 pb-3">
      <div
        className={`projects-column ${direction === "up" ? "projects-column-up" : "projects-column-down"}`}
      >
        {repeatedItems.map((project, index) => (
          <ProjectArchiveCard
            key={`${project.slug}-${index}`}
            project={project}
            index={index % items.length}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectArchiveCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <article className="group">
      {/* p-0 — imagem vai rente ao topo do card, sem margem acima */}
      <Card className="overflow-hidden border-border/35 bg-card/75 p-0 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/55">
        {/* Preview — imagem flush ao topo */}
        <div
          className={`relative aspect-video w-full overflow-hidden ${!project.previewImage ? project.accentGradient : "bg-card/30"}`}
        >
          {project.previewImage && (
            <Image
              src={project.previewImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale brightness-[0.32]"
              style={{ objectPosition: project.previewImageFocus ?? "center" }}
              aria-hidden="true"
            />
          )}

          {/* Overlay escurecendo de cima para baixo */}
          <div className="absolute inset-0 bg-linear-to-b from-background/25 via-background/50 to-background/88" />

          {/* Vinheta radial */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_55%)]" />

          {/* Label + índice */}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
            <span>{project.placeholderLabel}</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>

          {/* Caption */}
          <div className="absolute inset-x-4 bottom-4">
            <p className="max-w-[28ch] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/85">
              {project.placeholderCaption}
            </p>
          </div>
        </div>

        {/* Conteúdo — padding apenas na área de texto */}
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {project.category}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                {project.title}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {project.metric}
            </span>
          </div>

          <p className="mt-3 max-w-[44ch] font-mono text-xs leading-relaxed text-muted-foreground">
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

          <a
            href={`/projetos/${project.slug}`}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 group-hover:text-accent"
          >
            Abrir case
            <BitmapChevron className="w-3 transition-transform duration-500 group-hover:rotate-45" />
          </a>
        </div>
      </Card>
    </article>
  );
}
