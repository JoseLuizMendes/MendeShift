/**
 * Plugin-free helpers for server components.
 * next-intl's getTranslations() requires the webpack plugin alias which
 * breaks in Next.js 16. These helpers load messages directly instead.
 */

type Messages = Record<string, unknown>;

export async function loadMessages(locale: string): Promise<Messages> {
  if (locale === "pt") {
    return (await import("../../messages/pt.json")).default as Messages;
  }
  return (await import("../../messages/en.json")).default as Messages;
}

export async function getServerTranslations(
  locale: string,
  namespace: string,
): Promise<(key: string, params?: Record<string, string | number>) => string> {
  const messages = await loadMessages(locale);
  const ns = (messages[namespace] ?? {}) as Record<string, string>;

  return (key: string, params?: Record<string, string | number>) => {
    let str = ns[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };
}
