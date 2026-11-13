import type { Metadata } from "next";

import { DEFAULT_LOCALE, localePrefix } from "@/lib/navigation";

/**
 * URL pública do site. Alimenta sitemap, robots, canonicals, og:url e JSON-LD.
 *
 * Ordem de resolução:
 *  1. `NEXT_PUBLIC_SITE_URL` — setada na Vercel quando houver domínio próprio.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — variável de sistema da Vercel com o
 *     domínio de produção do projeto (vale também em previews, então o
 *     canonical de um preview continua apontando para produção).
 *  3. Fallback fixo para build local.
 *
 * Um endereço errado aqui faz canonical/sitemap/og:image apontarem para um
 * site que não existe — por isso o fallback não é mais digitado à mão.
 * Só é lida no servidor (metadata, sitemap, feeds, OG).
 */
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionHost
    ? `https://${vercelProductionHost}`
    : "https://mende-shift.vercel.app")
).replace(/\/$/, "");

/** Host sem protocolo, para exibir nas imagens OG. */
export const SITE_HOST = new URL(SITE_URL).host;

/** URL absoluta de um caminho (sem locale, ex.: "/servicos") num locale. */
export function localizedUrl(locale: string, path = ""): string {
  return `${SITE_URL}${localePrefix(locale)}${path}`;
}

type PageMetadataInput = {
  locale: string;
  /** Caminho sem locale, começando com "/" (home = ""). Ex.: "/servicos". */
  path: string;
  title: string;
  description: string;
};

/**
 * Metadata completa de uma página sob [locale].
 *
 * Sem isto, as subpáginas herdam `alternates`/`openGraph` do layout e
 * declaram a home como canonical — o que anula o SEO delas. Cada página
 * deve apontar canonical/og:url para o próprio endereço, seguindo a
 * convenção localePrefix "as-needed": PT na raiz, EN sob /en.
 *
 * og:image não é definida aqui — vem do opengraph-image.tsx file-based
 * do segmento, que tem precedência.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetadataInput): Metadata {
  const url = localizedUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        pt: localizedUrl("pt", path),
        en: localizedUrl("en", path),
        // Quem não casa com nenhum idioma recebe o locale padrão.
        "x-default": localizedUrl(DEFAULT_LOCALE, path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "MendeShift",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
