"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "@/i18n/context";

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "pt" : "en";

  function switchLanguage() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax${secure}`;

    const override = document.getElementById("lang-alternate")?.dataset[targetLocale];
    const path = locale === "pt" ? pathname.replace(/^\/pt(?=\/|$)/, "") || "/" : `/pt${pathname}`;
    window.location.href = override ?? `${path}${window.location.hash}`;
  }

  return (
    <button
      type="button"
      className="portfolio-language"
      onClick={switchLanguage}
      aria-label={t(targetLocale === "pt" ? "switch_to_portuguese" : "switch_to_english")}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}
