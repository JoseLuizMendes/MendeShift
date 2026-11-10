import type { Metadata } from "next";

import { getServerTranslations } from "@/i18n/server";
import { SITE_URL, pageMetadata } from "@/lib/metadata";
import { getBlogPosts, getBlogTags, type Locale } from "@/lib/blog";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { ColophonSection } from "@/_components/colophon-section";
import { PostCard } from "@/_components/blog/post-card";
import { TagFilter } from "@/_components/blog/tag-filter";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  const base = pageMetadata({
    locale,
    path: "/blog",
    title: t("blog_title"),
    description: t("blog_desc"),
  });
  const feedUrl =
    locale === "pt"
      ? `${SITE_URL}/pt/blog/feed.xml`
      : `${SITE_URL}/blog/feed.xml`;
  base.alternates = {
    ...base.alternates,
    types: { "application/rss+xml": feedUrl },
  };
  return base;
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const t = await getServerTranslations(locale, "blog");
  const activeTag = tag ?? null;

  const allPosts = getBlogPosts(locale as Locale);
  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;
  const tags = getBlogTags(locale as Locale);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="blog-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-20 md:pt-28">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:py-16">
              <div className="max-w-2xl">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <SectionTitle className="mt-4">{t("title")}</SectionTitle>
                <SectionLead>{t("lead")}</SectionLead>
              </div>
              <TagFilter
                tags={tags}
                activeTag={activeTag}
                locale={locale as Locale}
                allLabel={t("all_tag")}
              />
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container className="md:px-30">
            {posts.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">
                {t("empty")}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    locale={locale as Locale}
                    readMoreLabel={t("read_more")}
                  />
                ))}
              </div>
            )}
            <div className="mt-16 border-t border-border/20 pt-10">
              <BackToHomeLink variant="ghost">{t("home")}</BackToHomeLink>
            </div>
          </Container>
        </section>
        <ColophonSection />
      </main>
    </>
  );
}
