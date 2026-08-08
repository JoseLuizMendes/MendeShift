import type { Locale } from "@/lib/blog";

/** Formata "YYYY-MM-DD" no padrão do locale, em UTC (sem drift de fuso). */
export function formatPostDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function PostMeta({
  date,
  tags,
  locale,
}: {
  date: string;
  tags: string[];
  locale: Locale;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      <time dateTime={date}>{formatPostDate(date, locale)}</time>
      {tags.length > 0 && (
        <>
          <span aria-hidden className="text-border">
            /
          </span>
          <span className="flex flex-wrap gap-2 text-accent">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </span>
        </>
      )}
    </div>
  );
}
