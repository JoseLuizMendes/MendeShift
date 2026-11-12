import Link from "next/link";
import type { Locale, PostSummary } from "@/lib/blog";
import { localeHref } from "@/lib/navigation";
import { Container } from "./ui/container";
import { Button } from "./ui/button";

type Labels = { title: string; cta: string };

export function RecentWritingSection({ posts, locale, labels }: {
  posts: PostSummary[];
  locale: Locale;
  labels: Labels;
}) {
  const post = posts[0];
  if (!post) return null;

  return (
    <section id="writing" className="border-t border-border/30 py-6">
      <Container className="grid items-center justify-items-start gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h2 className="portfolio-mono mb-2 text-accent">{labels.title}</h2>
          <Link className="text-lg text-foreground underline-offset-4 hover:underline focus-visible:underline" href={localeHref(`/blog/${post.slug}`, locale)}>
            {post.title}
          </Link>
        </div>
        <Button href="/blog" variant="secondary" className="min-h-11 border-accent/50 bg-accent/10 hover:bg-accent/20">
          {labels.cta} <span aria-hidden="true">↗</span>
        </Button>
      </Container>
    </section>
  );
}
