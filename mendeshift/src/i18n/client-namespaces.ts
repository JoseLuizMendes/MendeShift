/**
 * Namespaces de messages/*.json lidos por componentes de cliente
 * (via `useTranslations`). Só eles vão no payload de cada página — o resto
 * (serviços, FAQ, textos de cases...) é renderizado no servidor e mandar o
 * JSON inteiro só engordava o HTML.
 *
 * Ao usar `useTranslations("x")` com um namespace novo num componente de
 * cliente, inclua "x" aqui. Em dev, o hook avisa no console quando falta.
 */
export const CLIENT_NAMESPACES = [
  "colophon",
  "contact",
  "contact_page",
  "experience_section",
  "hero",
  "nav",
  "portfolio",
  "principles",
] as const;

export function pickClientMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    CLIENT_NAMESPACES.filter((namespace) => namespace in messages).map(
      (namespace) => [namespace, messages[namespace]],
    ),
  );
}
