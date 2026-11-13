import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE } from "@/lib/navigation";

export const routing = defineRouting({
  locales: ["pt", "en"],
  // PT na raiz: o público e as buscas-alvo ("criação de sites em Vitória")
  // são em português, e buscadores rastreiam sem Accept-Language — recebem
  // o locale padrão. EN fica em /en. URLs antigas /pt/... são redirecionadas
  // para a raiz pelo próprio middleware.
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
});
