import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServerTranslations } from "@/i18n/server";
import { SITE_URL, pageMetadata } from "@/lib/metadata";
import {
  getAlternateBlogSlug,
  getBlogPost,
  getBlogStaticParams,
  type Locale,
} from "@/lib/blog";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { ColophonSection } from "@/_components/colophon-section";
import { LanguageFallbackNotice } from "@/_components/blog/language-fallback-notice";
import { PostBody } from "@/_components/blog/post-body";
import { PostMeta } from "@/_components/blog/post-meta";
import { ActionLink } from "@/_components/ui/action-link";
import { Container } from "@/_components/ui/container";
import { SectionTitle } from "@/_components/ui/section";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return (["en", "pt"] as const).flatMap((locale) =>
    getBlogStaticParams(locale).map(({ slug }) => ({ locale, slug })),
  );
}

/** Resolve os slugs equivalentes en/pt (para alternates e language-toggle). */
function resolveSlugs(slug: string, locale: Locale) {
  const other: Locale = locale === "en" ? "pt" : "en";
  const alt = getAlternateBlogSlug(slug, locale, other);
  const altSlug = alt?.slug ?? slug;
  return {
    enSlug: locale === "en" ? slug : altSlug,
    ptSlug: locale === "pt" ? slug : altSlug,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = getBlogPost(slug, locale as Locale);
  if (!result) return {};

  const base = pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${result.post.frontmatter.title} | MendeShift`,
    description: result.post.frontmatter.description,
  });

  const { enSlug, ptSlug } = resolveSlugs(slug, locale as Locale);
  base.alternates = {
    ...base.alternates,
    languages: {
      en: `${SITE_URL}/blog/${enSlug}`,
      pt: `${SITE_URL}/pt/blog/${ptSlug}`,
    },
  };
  return base;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const result = getBlogPost(slug, locale as Locale);
  if (!result) notFound();

  const { post, isFallback } = result;
  const t = await getServerTranslations(locale, "blog");
  const { enSlug, ptSlug } = resolveSlugs(slug, locale as Locale);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    inLanguage: post.locale,
    keywords: post.frontmatter.tags.join(", "),
    url: `${SITE_URL}${locale === "pt" ? "/pt" : ""}/blog/${slug}`,
    author: { "@type": "Person", name: "José Luiz Mendes" },
    publisher: { "@type": "Organization", name: "MendeShift" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Override opt-in do language-toggle: mapeia o slug por idioma. */}
      <div
        id="lang-alternate"
        hidden
        data-en={`/blog/${enSlug}`}
        data-pt={`/pt/blog/${ptSlug}`}
      />
      <div className="noise-overlay" aria-hidden="true" />
      <main id="post-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-20 md:pt-28">
          <Container className="md:px-30">
            <div className="max-w-3xl py-12 md:py-16">
              <ActionLink
                href="/blog"
                variant="ghost"
                className="px-0 text-accent hover:text-accent/80"
              >
                {t("back")}
              </ActionLink>
              <SectionTitle className="mt-6">
                {post.frontmatter.title}
              </SectionTitle>
              <div className="mt-6">
                <PostMeta
                  date={post.frontmatter.date}
                  tags={post.frontmatter.tags}
                  locale={post.locale}
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container className="md:px-30">
            <div className="mx-auto max-w-3xl">
              {isFallback && (
                <LanguageFallbackNotice message={t("fallback_notice")} />
              )}
              <PostBody source={post.content} />

              <div className="mt-16 flex flex-col gap-4 border-t border-border/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <ActionLink href="/blog" variant="ghost">
                  {t("back")}
                </ActionLink>
                <BackToHomeLink variant="ghost">{t("home")}</BackToHomeLink>
              </div>
            </div>
          </Container>
        </section>
        <ColophonSection topHref="#post-top" />
      </main>
    </>
  );
}
