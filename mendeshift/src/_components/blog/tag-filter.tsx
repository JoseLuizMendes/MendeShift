import Link from "next/link";

import type { Locale, TagCount } from "@/lib/blog";
import { localeHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Filtro por tag — chips que são apenas links (`?tag=`). Sem estado no
 * cliente: o índice lê o searchParam no server e filtra. YAGNI.
 */
export function TagFilter({
  tags,
  activeTag,
  locale,
  allLabel,
}: {
  tags: TagCount[];
  activeTag: string | null;
  locale: Locale;
  allLabel: string;
}) {
  if (tags.length === 0) return null;

  const base = localeHref("/blog", locale);
  const chip =
    "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors duration-300";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={base}
        className={cn(
          chip,
          activeTag === null
            ? "border-accent/60 text-accent"
            : "border-border/40 text-muted-foreground hover:border-accent/40 hover:text-accent",
        )}
      >
        {allLabel}
      </Link>
      {tags.map(({ tag, count }) => {
        const active = activeTag === tag;
        return (
          <Link
            key={tag}
            href={`${base}?tag=${encodeURIComponent(tag)}`}
            aria-current={active ? "true" : undefined}
            className={cn(
              chip,
              active
                ? "border-accent/60 text-accent"
                : "border-border/40 text-muted-foreground hover:border-accent/40 hover:text-accent",
            )}
          >
            #{tag} <span className="text-muted-foreground/60">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
