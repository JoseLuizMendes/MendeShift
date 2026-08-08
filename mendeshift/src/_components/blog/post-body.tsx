import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

/**
 * Render do corpo MDX de um post — Server Component assíncrono.
 *
 * O frontmatter já foi extraído em `blog.ts`; aqui recebemos só o corpo.
 * Syntax highlighting é feito em BUILD por rehype-pretty-code (shiki) → zero
 * JS no cliente. Blocos de código e código inline são estilizados por CSS
 * (`.prose-blog` em globals.css), o resto pelos componentes abaixo.
 */

const prettyCodeOptions: Options = {
  theme: "github-dark-dimmed",
  keepBackground: true,
};

const components = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-14 mb-4 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 mb-3 font-display text-xl tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="my-5 font-mono text-sm leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-5 list-disc space-y-2 pl-5 font-mono text-sm leading-relaxed text-muted-foreground marker:text-accent"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-5 font-mono text-sm leading-relaxed text-muted-foreground marker:text-accent"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1.5" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 border-l-2 border-accent/60 pl-5 font-display text-xl italic tracking-tight text-foreground/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border/30" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const cls =
      "text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent";
    if (isInternal) {
      return <Link href={href} className={cls} {...props} />;
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...props} />
    );
  },
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className="my-8 w-full rounded-[var(--radius)] border border-border/40"
      {...props}
    />
  ),
};

export async function PostBody({ source }: { source: string }) {
  return (
    <div className="prose-blog max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
          },
        }}
      />
    </div>
  );
}
