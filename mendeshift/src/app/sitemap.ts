import type { MetadataRoute } from "next";

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
    { path: "/experience", priority: 0.5, changeFrequency: "yearly" as const },
    ...projects.map((project) => ({
      path: `/projetos/${project.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  // Sem lastModified: new Date() a cada build vira informação falsa
  // para o Google; melhor omitir do que mentir.
  return routes.map(({ path, priority, changeFrequency }) => ({
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
}
