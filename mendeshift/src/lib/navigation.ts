// Chaves compartilhadas da navegação (scroll restoration).
// Em módulo próprio para não quebrar o Fast Refresh: exportar constantes
// de um arquivo de componente força full reload em dev.

/** Prefixo das posições de scroll salvas por rota (sessionStorage). */
export const SCROLL_KEY_PREFIX = "mendeshift:scroll:";

/**
 * Locale servido na raiz do site (sem prefixo na URL). Os demais ficam sob
 * `/<locale>`. Fonte única: o roteamento (src/i18n/routing.ts), os links,
 * canonicals, sitemap e feeds leem daqui.
 */
export const DEFAULT_LOCALE = "pt";

/** Prefixo de URL de um locale: "" para o padrão, "/en" para o inglês. */
export function localePrefix(locale: string): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Prefixa hrefs internos com o locale ativo, seguindo o localePrefix
 * "as-needed" do middleware: PT (padrão) vive na raiz, EN sob /en.
 *
 * Sem isso, um visitante em /en que clica num link "/servicos" cai na
 * versão em português. Hrefs externos, mailto:, âncoras e caminhos já
 * prefixados passam intactos.
 */
export function localeHref(href: string, locale: string): string {
  if (!href.startsWith("/")) return href;

  if (locale === DEFAULT_LOCALE) {
    // Tira um prefixo redundante ("/pt/servicos" → "/servicos") para o link
    // não passar por um redirect do middleware.
    const own = `/${locale}`;
    if (href === own) return "/";
    if (href.startsWith(`${own}/`)) return href.slice(own.length);
    if (href.startsWith(`${own}#`)) return `/${href.slice(own.length)}`;
    return href;
  }

  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}#`)) {
    return href;
  }
  return `/${locale}${href}`;
}
