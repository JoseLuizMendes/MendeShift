import type { Metadata } from "next";

import { getServerTranslations } from "@/i18n/server";
import { localizedUrl, pageMetadata } from "@/lib/metadata";
import { getBlogPosts, getBlogTags, type Locale } from "@/lib/blog";
import { BackToHomeLink } from "@/_components/back-to-home-link";
import { ColophonSection } from "@/_components/colophon-section";
import { PostCard } from "@/_components/blog/post-card";
import { TagFilter } from "@/_components/blog/tag-filter";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead } from "@/_components/ui/section";

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
  const feedUrl = localizedUrl(locale, "/blog/feed.xml");
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
        <section className="border-b border-border/20">
          <Container className="md:px-30">
            <div className="flex flex-col gap-5 py-7 md:py-10">
              <div className="max-w-2xl">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <h1 className="portfolio-display mt-4">{t("title")}</h1>
                <SectionLead className="mt-3">{t("lead")}</SectionLead>
              </div>
              {allPosts.length > 1 && <TagFilter
                tags={tags}
                activeTag={activeTag}
                locale={locale as Locale}
                allLabel={t("all_tag")}
              />}
            </div>
          </Container>
        </section>

        <section className="py-6 md:py-9">
          <Container className="md:px-30">
            {posts.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">
                {t("empty")}
              </p>
            ) : (
              <div className={posts.length > 1 ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
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
            <div className="mt-7 border-t border-border/20 pt-4">
              <BackToHomeLink variant="secondary">{t("home")}</BackToHomeLink>
            </div>
          </Container>
        </section>
        <ColophonSection />
      </main>
    </>
  );
}
