"use client";

import { createContext, useContext, type ReactNode } from "react";

type Messages = Record<string, unknown>;

interface IntlContextValue {
  locale: string;
  messages: Messages;
}

const IntlContext = createContext<IntlContextValue>({
  locale: "en",
  messages: {},
});

export function TranslationsProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <IntlContext.Provider value={{ locale, messages }}>
      {children}
    </IntlContext.Provider>
  );
}

type TFunction = {
  (key: string, params?: Record<string, string | number>): string;
  raw(key: string): unknown;
};

export function useTranslations(namespace: string): TFunction {
  const { messages } = useContext(IntlContext);
  const ns = (messages[namespace] ?? {}) as Record<string, unknown>;

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = (ns[key] as string) ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };

  t.raw = (key: string): unknown => ns[key];

  return t as TFunction;
}

export function useLocale(): string {
  return useContext(IntlContext).locale;
}
