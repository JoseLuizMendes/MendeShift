// Chaves compartilhadas da navegação (scroll restoration).
// Em módulo próprio para não quebrar o Fast Refresh: exportar constantes
// de um arquivo de componente força full reload em dev.

/** Prefixo das posições de scroll salvas por rota (sessionStorage). */
export const SCROLL_KEY_PREFIX = "mendeshift:scroll:";
