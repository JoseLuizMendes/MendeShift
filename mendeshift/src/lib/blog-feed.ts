import { getBlogPosts, type Locale } from "@/lib/blog";
import { SITE_URL } from "@/lib/metadata";

/**
 * Gera o XML do feed RSS 2.0 de um locale. Compartilhado pelas rotas
 * top-level `/blog/feed.xml` (en) e `/pt/blog/feed.xml` (pt).
 *
 * Fica FORA de [locale] de propósito: o middleware do next-intl ignora
 * paths com ponto (`.xml`), então a URL sem prefixo não seria reescrita —
 * mesmo motivo pelo qual sitemap.ts/robots.ts moram no topo de app/.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildBlogFeed(locale: Locale): string {
  const posts = getBlogPosts(locale);
  const base = locale === "pt" ? `${SITE_URL}/pt` : SITE_URL;
  const title = "MendeShift — Blog";
  const description =
    locale === "pt"
      ? "Notas sobre arquitetura, engenharia e o que estou aprendendo."
      : "Notes on architecture, engineering and what I'm learning.";

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${base}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>${locale === "pt" ? "pt-BR" : "en-US"}</language>
    <atom:link href="${base}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
