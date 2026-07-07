// Chaves compartilhadas da navegação (scroll restoration).
// Em módulo próprio para não quebrar o Fast Refresh: exportar constantes
// de um arquivo de componente força full reload em dev.

/** Prefixo das posições de scroll salvas por rota (sessionStorage). */
export const SCROLL_KEY_PREFIX = "mendeshift:scroll:";

/**
 * Prefixa hrefs internos com o locale ativo, seguindo o localePrefix
 * "as-needed" do middleware: EN (default) vive na raiz, PT sob /pt.
 *
 * Sem isso, um visitante em /pt que clica num link "/servicos" cai na
 * versão em inglês. Hrefs externos, mailto:, âncoras e caminhos já
 * prefixados passam intactos.
 */
export function localeHref(href: string, locale: string): string {
  if (!href.startsWith("/") || locale === "en") return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}#`)) {
    return href;
  }
  return `/${locale}${href}`;
}
