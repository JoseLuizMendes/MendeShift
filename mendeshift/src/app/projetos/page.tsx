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
            <div className="hidden gap-6 lg:grid lg:grid-cols-2">
              <ProjectsColumn items={leftColumn} direction="up" />
              <ProjectsColumn items={rightColumn} direction="down" />
            </div>

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
    <div className="relative h-295 overflow-hidden rounded-[calc(var(--radius)+4px)] border border-border/25 bg-card/20 p-4">
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
      <Card className="overflow-hidden border-border/35 bg-card/75 p-5 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/55 sm:p-6">
        {/* Preview — imagem real ou fallback gradient */}
        <div
          className={`relative min-h-57.5 overflow-hidden rounded-[calc(var(--radius)-4px)] border border-border/25 ${!project.previewImage ? project.accentGradient : "bg-card/30"}`}
        >
          {/* Camada 1 — screenshot do projeto (grayscale + escurecido) */}
          {project.previewImage && (
            <Image
              src={project.previewImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale brightness-[0.32]"
              style={{ objectPosition: project.previewImageFocus ?? "top" }}
              aria-hidden="true"
            />
          )}

          {/* Camada 2 — overlay escurecendo de cima para baixo */}
          <div className="absolute inset-0 bg-linear-to-b from-background/25 via-background/50 to-background/88" />

          {/* Camada 3 — vinheta radial no canto superior esquerdo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_55%)]" />

          {/* Conteúdo — label + índice */}
          <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
            <span>{project.placeholderLabel}</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>

          {/* Conteúdo — wireframe blocks + caption */}
          <div className="absolute inset-x-5 bottom-5">
            <p className="mt-4 max-w-[28ch] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/85">
              {project.placeholderCaption}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {project.category}
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              {project.title}
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {project.metric}
          </span>
        </div>

        <p className="mt-4 max-w-[44ch] font-mono text-xs leading-relaxed text-muted-foreground">
          {project.shortDesc}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/75"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={`/projetos/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 group-hover:text-accent"
        >
          Abrir case
          <BitmapChevron className="w-3 transition-transform duration-500 group-hover:rotate-45" />
        </a>
      </Card>
    </article>
  );
}