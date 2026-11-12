import Link from "next/link";
import type { Locale, PostSummary } from "@/lib/blog";
import { localeHref } from "@/lib/navigation";
import { Container } from "./ui/container";
import { ArrowUpRight } from "lucide-react";

export function RecentWritingSection({ posts, locale, title }: {
  posts: PostSummary[];
  locale: Locale;
  title: string;
}) {
  const post = posts[0];
  if (!post) return null;

  return (
    <section id="writing" className="border-t border-border/30 py-6">
      <Container>
        <h2 className="portfolio-mono mb-3 text-accent">{title}</h2>
        <Link
          className="flex min-h-11 w-fit max-w-full items-center gap-4 border border-foreground/20 bg-muted px-4 py-2 text-sm text-foreground transition-colors interaction-motion hover:border-foreground/50 focus-visible:outline-2 focus-visible:outline-accent sm:text-base"
          href={localeHref(`/blog/${post.slug}`, locale)}
        >
          <span>{post.title}</span>
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      </Container>
    </section>
  );
}
