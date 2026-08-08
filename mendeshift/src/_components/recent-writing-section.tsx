import type { Locale, PostSummary } from "@/lib/blog";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";
import { PostCard } from "@/_components/blog/post-card";
import { BitmapChevron } from "./bitmap-chevron";

type Labels = {
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
  readMore: string;
};

/**
 * Seção "escritos recentes" na home — descoberta do blog + prova de que ele
 * está vivo. Server Component; nada é renderizado se não houver posts.
 */
export function RecentWritingSection({
  posts,
  locale,
  labels,
}: {
  posts: PostSummary[];
  locale: Locale;
  labels: Labels;
}) {
  if (posts.length === 0) return null;

  return (
    <Section id="writing" className="relative border-t border-border/20">
      <Container className="md:px-30">
        <div className="mb-8 flex flex-col gap-4 md:mb-10">
          <div>
            <Eyebrow>{labels.eyebrow}</Eyebrow>
            <SectionTitle>{labels.title}</SectionTitle>
          </div>
          <SectionLead className="mt-0">{labels.lead}</SectionLead>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              locale={locale}
              readMoreLabel={labels.readMore}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end border-t border-border/20 pt-6 md:mt-10">
          <Button href="/blog" variant="ghost" className="group">
            {labels.cta}
            <BitmapChevron className="w-3 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
