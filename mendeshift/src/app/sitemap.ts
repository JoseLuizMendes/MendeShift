import type { MetadataRoute } from "next";

import { getAlternateBlogSlug, getBlogPosts } from "@/lib/blog";
import { localizedUrl } from "@/lib/metadata";
import { projects } from "@/lib/projects";

/**
 * Sitemap de todas as rotas × locales.
 * Locale padrão (pt) vive na raiz; en em /en — mesmo padrão dos
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
    { path: "/ai-exploration", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" as const },
    ...projects.map((project) => ({
      path: `/projetos/${project.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  // Sem lastModified: new Date() a cada build vira informação falsa
  // para o Google; melhor omitir do que mentir.
  const staticEntries = routes.map(({ path, priority, changeFrequency }) => ({
    url: localizedUrl("pt", path),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        pt: localizedUrl("pt", path),
        en: localizedUrl("en", path),
      },
    },
  }));

  // Posts com versão PT (slug por idioma → alternate en só quando traduzido).
  const ptPostEntries = getBlogPosts("pt").map((post) => {
    const enAlt = getAlternateBlogSlug(post.slug, "pt", "en");
    const enSlug = enAlt && !enAlt.isFallback ? enAlt.slug : null;
    return {
      url: localizedUrl("pt", `/blog/${post.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          pt: localizedUrl("pt", `/blog/${post.slug}`),
          ...(enSlug ? { en: localizedUrl("en", `/blog/${enSlug}`) } : {}),
        },
      },
    };
  });

  // Posts que só existem em EN (sem tradução PT) — entram sob /en.
  const enOnlyPostEntries = getBlogPosts("en")
    .filter((post) => {
      const ptAlt = getAlternateBlogSlug(post.slug, "en", "pt");
      return !ptAlt || ptAlt.isFallback;
    })
    .map((post) => ({
      url: localizedUrl("en", `/blog/${post.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...ptPostEntries, ...enOnlyPostEntries];
}
