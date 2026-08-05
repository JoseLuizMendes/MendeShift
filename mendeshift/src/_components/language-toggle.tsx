"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/i18n/context";
import { usePathname } from "next/navigation";

import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { cn } from "@/lib/utils";
import { LanguagesIcon } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrambleToken, setScrambleToken] = useState(0);

  const targetLocale = locale === "en" ? "pt" : "en";
  const label = targetLocale.toUpperCase();

  const handleSwitch = () => {
    // Override the NEXT_LOCALE cookie so middleware respects the switch.
    // Secure só em HTTPS (produção) — em dev local http o Secure impediria
    // a gravação do cookie.
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax${secure}`;

    let newPath: string;
    if (locale === "pt") {
      newPath = pathname.replace(/^\/pt/, "") || "/";
    } else {
      newPath = `/pt${pathname}`;
    }

    // Full page navigation ensures middleware processes the new locale correctly
    window.location.href = newPath;
  };

  return (
    <button
  type="button"
  onClick={handleSwitch}
  onMouseEnter={() => setScrambleToken((prev) => prev + 1)}
  onFocus={() => setScrambleToken((prev) => prev + 1)}
  className={cn(
    "fixed bottom-6 right-6 z-50 hidden md:flex",
    "h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80",
    "backdrop-blur-sm transition-all duration-300",
    "hover:border-accent/60 hover:text-accent",
    className,
  )}
  aria-label={t(targetLocale === "pt" ? "switch_to_portuguese" : "switch_to_english")}
>
  {/* Certifique-se de que o ícone possui aria-hidden se for apenas decorativo */}
  <LanguagesIcon className="h-4 w-4" aria-hidden="true" />
</button>
  );
}
