import Link from "next/link";

import type { Locale, PostSummary } from "@/lib/blog";
import { localeHref } from "@/lib/navigation";
import { PostMeta } from "./post-meta";

export function PostCard({
  post,
  locale,
  readMoreLabel,
}: {
  post: PostSummary;
  locale: Locale;
  readMoreLabel: string;
}) {
  return (
    <article className="glare group relative flex flex-col overflow-hidden rounded-lg border border-border/40 bg-card/70 p-6 transition-all duration-500 ease-emphasis hover:-translate-y-1 hover:border-accent/60 active:-translate-y-0.5 active:border-accent/60">
      <span className="glare__streak" aria-hidden="true" />
      <PostMeta date={post.date} tags={post.tags} locale={locale} />
      <h3 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 font-mono text-xs leading-relaxed text-muted-foreground">
        {post.description}
      </p>
      <Link
        href={localeHref(`/blog/${post.slug}`, locale)}
        className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-accent after:absolute after:inset-0"
      >
        {readMoreLabel} →
      </Link>
    </article>
  );
}
