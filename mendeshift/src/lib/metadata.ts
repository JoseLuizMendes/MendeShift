import type { Metadata } from "next";

/**
 * URL pública do site. Alimenta sitemap, robots, canonicals, og:url e JSON-LD.
 *
 * Definida por `NEXT_PUBLIC_SITE_URL` (setada na Vercel), com fallback para o
 * domínio atual. Quando o domínio próprio for registrado, basta atualizar a
 * env var na Vercel e redeployar — nenhum commit é necessário.
 * Como é `NEXT_PUBLIC_*`, o valor é inlined no build (SSG) e vale também no client.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mendeshift.vercel.app"
).replace(/\/$/, "");

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
