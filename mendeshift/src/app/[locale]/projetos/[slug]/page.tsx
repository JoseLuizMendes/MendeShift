import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerTranslations, loadMessages } from "@/i18n/server";
import { SITE_URL, pageMetadata } from "@/lib/metadata";
import { localeHref } from "@/lib/navigation";
import { getProjectBySlug, getProjectsByLocale, serviceAnchors } from "@/lib/projects";
import { ColophonSection } from "@/_components/colophon-section";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getProjectsByLocale("en").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projetos/${slug}`,
    title: `${project.title} | MendeShift`,
    description: project.shortDesc,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) notFound();

  const [t, ui, messages] = await Promise.all([
    getServerTranslations(locale, "project_detail"),
    getServerTranslations(locale, "portfolio"),
    loadMessages(locale),
  ]);
  const serviceAnchor = serviceAnchors[project.serviceType];
  const services = (messages.services_page as { items: { slug: string; title: string }[] }).items;
  const serviceTitle = services.find((service) => service.slug === serviceAnchor)?.title;
  const projects = getProjectsByLocale(locale);
  const index = projects.findIndex((item) => item.slug === slug);
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const number = String(index + 1).padStart(2, "0");
  const href = (path: string) => localeHref(path, locale);
  const caseJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDesc,
    url: `${SITE_URL}${href(`/projetos/${slug}`)}`,
    creator: { "@type": "Organization", name: "MendeShift" },
    ...(project.previewImage && { image: `${SITE_URL}${project.previewImage}` }),
  };

  return (
    <main id="project-top" className="app-shell min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd) }} />
      <div className="portfolio-frame">
        <div className="portfolio-case">
          <header className="portfolio-case-intro">
            <Link className="portfolio-text-link" href={href("/projetos")}>{t("all_projects")}</Link>
            <div>
              <p className="portfolio-mono text-accent">CASE {number} / {project.category}</p>
              <h1 className="portfolio-display">{project.title}<span className="text-accent">.</span></h1>
              <p>{project.shortDesc}</p>
            </div>
            <dl className="portfolio-case-meta">
              {project.metric && <div><dt>{ui("case_status")}</dt><dd>{project.metric}</dd></div>}
              <div><dt>Stack</dt><dd>{project.tech.join(" / ")}</dd></div>
            </dl>
            {serviceTitle && (
              <Link className="portfolio-text-link" href={`/${locale}/servicos#${serviceAnchor}`}>
                {t("service_cta", { service: serviceTitle })}
              </Link>
            )}
          </header>

          {project.previewImage && (
            <figure className="portfolio-case-figure">
              <div className="portfolio-case-image">
                <Image
                  src={project.previewImage}
                  alt={project.previewImageAlt ?? ""}
                  sizes="(max-width: 760px) 100vw, 62vw"
                  fill
                  preload
                />
              </div>
              <figcaption className="portfolio-mono"><span>FIG. {number}</span><span>{ui("artwork")}</span></figcaption>
            </figure>
          )}
        </div>

        <div className="portfolio-case-body">
          <CaseSection label={t("context")}><p>{project.context}</p></CaseSection>
          <CaseSection label={t("problem")}><p>{project.problem}</p></CaseSection>
          <CaseSection label={t("constraints")}><p>{project.constraints}</p></CaseSection>
          <CaseSection label={t("solution")}><p>{project.solution}</p></CaseSection>
          <CaseSection label={t("engineering")}>
            <ol>{project.engineeringDecisions.map((decision) => <li key={decision}>{decision}</li>)}</ol>
          </CaseSection>
          <CaseSection label={t("challenges")}>
            <ul>{project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}</ul>
          </CaseSection>
          <CaseSection label={t("outcome")}><p>{project.outcome}</p></CaseSection>
        </div>

        <nav className="portfolio-case-pagination portfolio-mono" aria-label={ui("case_navigation")}>
          {previous && <Link href={href(`/projetos/${previous.slug}`)}>← {previous.title}</Link>}
          {next && <Link href={href(`/projetos/${next.slug}`)}>{t("next", { title: next.title })}</Link>}
        </nav>
      </div>
      <ColophonSection />
    </main>
  );
}

function CaseSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="portfolio-case-row">
      <h2 className="portfolio-mono">{label}</h2>
      <div>{children}</div>
    </section>
  );
}
