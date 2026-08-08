import type { MetadataRoute } from "next";

import { getAlternateBlogSlug, getBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/metadata";
import { projects } from "@/lib/projects";

const BASE_URL = SITE_URL;

/**
 * Sitemap de todas as rotas × locales.
 * Locale default (en) vive na raiz; pt em /pt — mesmo padrão dos
 * alternates do layout.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/servicos", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contato", priority: 0.9, changeFrequency: "yearly" as const },
    { path: "/projetos", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/experience", priority: 0.5, changeFrequency: "yearly" as const },
    ...projects.map((project) => ({
      path: `/projetos/${project.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  // Sem lastModified: new Date() a cada build vira informação falsa
  // para o Google; melhor omitir do que mentir.
  const staticEntries = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}${path}`,
        pt: `${BASE_URL}/pt${path}`,
      },
    },
  }));

  // Posts com versão EN (slug por idioma → alternate pt só quando traduzido).
  const enPostEntries = getBlogPosts("en").map((post) => {
    const ptAlt = getAlternateBlogSlug(post.slug, "en", "pt");
    const ptSlug = ptAlt && !ptAlt.isFallback ? ptAlt.slug : null;
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: `${BASE_URL}/blog/${post.slug}`,
          ...(ptSlug ? { pt: `${BASE_URL}/pt/blog/${ptSlug}` } : {}),
        },
      },
    };
  });

  // Posts que só existem em PT (sem tradução EN) — entram sob /pt.
  const ptOnlyPostEntries = getBlogPosts("pt")
    .filter((post) => {
      const enAlt = getAlternateBlogSlug(post.slug, "pt", "en");
      return !enAlt || enAlt.isFallback;
    })
    .map((post) => ({
      url: `${BASE_URL}/pt/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...enPostEntries, ...ptOnlyPostEntries];
}
