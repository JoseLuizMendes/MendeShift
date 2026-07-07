import type { Metadata } from "next";

/**
 * URL pública do site. Quando o domínio próprio for registrado
 * (ex.: mendeshift.com.br), basta trocar aqui — sitemap, robots,
 * canonicals e JSON-LD consomem esta constante.
 */
export const SITE_URL = "https://mendeshift.vercel.app";

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
 * convenção localePrefix "as-needed": EN na raiz, PT sob /pt.
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
  const localizedUrl = `${SITE_URL}${locale === "pt" ? `/pt${path}` : path}`;

  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl,
      languages: {
        en: `${SITE_URL}${path}`,
        pt: `${SITE_URL}/pt${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: localizedUrl,
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
