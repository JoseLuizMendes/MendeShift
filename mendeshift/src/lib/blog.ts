import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

/**
 * Data layer do blog — funções PURAS separadas da leitura de disco.
 *
 * Arquitetura (SOLID / responsabilidade única):
 *  - `parsePostFile`/`buildBlogIndex` + as funções `*FromIndex` são puras:
 *    recebem dados e devolvem dados, sem tocar em `fs`. É o seam testável.
 *  - As funções `getBlog*` no fim são a fina casca de IO: leem os arquivos
 *    `content/blog/<pasta>/{en,pt}.mdx`, montam o índice (com cache) e delegam.
 *
 * Trocar MDX por um CMS um dia mexe só na casca de IO — a lógica não muda.
 */

export const LOCALES = ["en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string): boolean {
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}

/** Schema do frontmatter. Post malformado quebra no build/teste, nunca em prod. */
export const frontmatterSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(KEBAB, "slug deve ser kebab-case (a-z, 0-9, hífens)"),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z
    .string()
    .regex(ISO_DATE, "date deve estar no formato YYYY-MM-DD")
    .refine(isRealDate, "date não é uma data válida"),
  tags: z
    .array(z.string())
    .default([])
    // normaliza: trim + lowercase, descarta vazias
    .transform((tags) =>
      tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    ),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

/** Arquivo cru lido do disco (ou fixture de teste). */
export interface RawPostFile {
  folderId: string;
  locale: Locale;
  raw: string;
}

/** Post já parseado: frontmatter + corpo MDX. */
export interface LoadedPost {
  folderId: string;
  locale: Locale;
  frontmatter: PostFrontmatter;
  content: string;
}

/** Resumo para listagens — frontmatter + metadados, SEM o corpo. */
export interface PostSummary extends PostFrontmatter {
  folderId: string;
  locale: Locale;
}

export interface PostResult {
  post: LoadedPost;
  /** true quando o post foi servido num idioma diferente do pedido. */
  isFallback: boolean;
}

export interface TagCount {
  tag: string;
  count: number;
}

interface QueryOptions {
  includeDrafts?: boolean;
}

// ---------------------------------------------------------------------------
// Camada pura
// ---------------------------------------------------------------------------

/** Faz parse de um arquivo cru: valida o frontmatter e separa o corpo. */
export function parsePostFile(file: RawPostFile): LoadedPost {
  const { data, content } = matter(file.raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new Error(
      `Frontmatter inválido em content/blog/${file.folderId}/${file.locale}.mdx — ${issues}`,
    );
  }
  return {
    folderId: file.folderId,
    locale: file.locale,
    frontmatter: parsed.data,
    content,
  };
}

/** Parseia todos os arquivos e valida unicidade de slug por locale. */
export function buildBlogIndex(files: RawPostFile[]): LoadedPost[] {
  const index = files.map(parsePostFile);

  const seen = new Map<string, string>(); // `${locale}:${slug}` -> folderId
  for (const post of index) {
    const key = `${post.locale}:${post.frontmatter.slug}`;
    const prev = seen.get(key);
    if (prev) {
      throw new Error(
        `Slug duplicado "${post.frontmatter.slug}" no locale ${post.locale} ` +
          `(pastas "${prev}" e "${post.folderId}").`,
      );
    }
    seen.set(key, post.folderId);
  }
  return index;
}

function visible(post: LoadedPost, opts: QueryOptions): boolean {
  return opts.includeDrafts === true || !post.frontmatter.draft;
}

/** Compara por data desc, com título asc como desempate (determinístico). */
function byDateDesc(a: LoadedPost, b: LoadedPost): number {
  if (a.frontmatter.date !== b.frontmatter.date) {
    return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
  }
  return a.frontmatter.title.localeCompare(b.frontmatter.title);
}

/** Lista os posts de um locale (sem o corpo), ordenados por data desc. */
export function listPostsFromIndex(
  index: LoadedPost[],
  locale: Locale,
  opts: QueryOptions = {},
): PostSummary[] {
  return index
    .filter((p) => p.locale === locale && visible(p, opts))
    .sort(byDateDesc)
    .map((post) => ({
      ...post.frontmatter,
      folderId: post.folderId,
      locale: post.locale,
    }));
}

/**
 * Acha um post por slug no locale pedido. Se não existir naquele idioma,
 * faz fallback pro idioma disponível (mesmo slug em outro locale) e sinaliza.
 */
export function findPostInIndex(
  index: LoadedPost[],
  slug: string,
  locale: Locale,
  opts: QueryOptions = {},
): PostResult | null {
  const candidates = index.filter((p) => visible(p, opts));

  const exact = candidates.find(
    (p) => p.locale === locale && p.frontmatter.slug === slug,
  );
  if (exact) return { post: exact, isFallback: false };

  const fallback = candidates.find((p) => p.frontmatter.slug === slug);
  if (fallback) return { post: fallback, isFallback: true };

  return null;
}

/**
 * Resolve o slug equivalente em `toLocale` para o `language-toggle`.
 * Usa o folderId como elo entre os idiomas de um mesmo post.
 * Sem tradução no idioma-alvo: devolve o slug atual + isFallback=true
 * (o toggle cai na página de fallback do outro idioma).
 */
export function alternateSlugFromIndex(
  index: LoadedPost[],
  slug: string,
  fromLocale: Locale,
  toLocale: Locale,
  opts: QueryOptions = {},
): { slug: string; isFallback: boolean } | null {
  const source = findPostInIndex(index, slug, fromLocale, opts);
  if (!source) return null;

  const target = index.find(
    (p) =>
      p.folderId === source.post.folderId &&
      p.locale === toLocale &&
      visible(p, opts),
  );
  if (target) return { slug: target.frontmatter.slug, isFallback: false };

  return { slug, isFallback: true };
}

/**
 * Slugs a gerar estaticamente para um locale: os posts nativos daquele idioma
 * MAIS URLs de fallback (posts que só existem no outro idioma), pra que a URL
 * de fallback também seja pré-renderizada.
 */
export function staticParamsFromIndex(
  index: LoadedPost[],
  locale: Locale,
  opts: QueryOptions = {},
): { slug: string }[] {
  const byFolder = new Map<string, LoadedPost[]>();
  for (const post of index) {
    if (!visible(post, opts)) continue;
    const list = byFolder.get(post.folderId) ?? [];
    list.push(post);
    byFolder.set(post.folderId, list);
  }

  const slugs = new Set<string>();
  for (const posts of byFolder.values()) {
    const native = posts.find((p) => p.locale === locale);
    if (native) {
      slugs.add(native.frontmatter.slug);
    } else if (posts.length > 0) {
      // fallback: expõe o post sob o slug do idioma disponível
      slugs.add(posts[0].frontmatter.slug);
    }
  }
  return [...slugs].map((slug) => ({ slug }));
}

/** Agrega e conta as tags de um locale, ordenadas por contagem desc. */
export function collectTagsFromIndex(
  index: LoadedPost[],
  locale: Locale,
  opts: QueryOptions = {},
): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of listPostsFromIndex(index, locale, opts)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// ---------------------------------------------------------------------------
// Casca de IO — lê content/blog/<pasta>/{en,pt}.mdx
// ---------------------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/** Em produção mostramos só posts publicados; em dev, drafts também. */
const INCLUDE_DRAFTS = process.env.NODE_ENV !== "production";

function loadRawPostFiles(): RawPostFile[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files: RawPostFile[] = [];
  for (const entry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const locale of LOCALES) {
      const filePath = path.join(CONTENT_DIR, entry.name, `${locale}.mdx`);
      if (fs.existsSync(filePath)) {
        files.push({
          folderId: entry.name,
          locale,
          raw: fs.readFileSync(filePath, "utf8"),
        });
      }
    }
  }
  return files;
}

let cachedIndex: LoadedPost[] | null = null;

function getIndex(): LoadedPost[] {
  // Em dev, relê a cada chamada pra refletir edições sem reiniciar.
  if (process.env.NODE_ENV !== "production") {
    return buildBlogIndex(loadRawPostFiles());
  }
  cachedIndex ??= buildBlogIndex(loadRawPostFiles());
  return cachedIndex;
}

const io: QueryOptions = { includeDrafts: INCLUDE_DRAFTS };

export function getBlogPosts(locale: Locale): PostSummary[] {
  return listPostsFromIndex(getIndex(), locale, io);
}

export function getBlogPost(slug: string, locale: Locale): PostResult | null {
  return findPostInIndex(getIndex(), slug, locale, io);
}

export function getBlogTags(locale: Locale): TagCount[] {
  return collectTagsFromIndex(getIndex(), locale, io);
}

export function getAlternateBlogSlug(
  slug: string,
  fromLocale: Locale,
  toLocale: Locale,
): { slug: string; isFallback: boolean } | null {
  return alternateSlugFromIndex(getIndex(), slug, fromLocale, toLocale, io);
}

export function getBlogStaticParams(locale: Locale): { slug: string }[] {
  return staticParamsFromIndex(getIndex(), locale, io);
}
