"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/context";
import { usePathname } from "next/navigation";

import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { cn } from "@/lib/utils";
import { LanguagesIcon } from "lucide-react";

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [scrambleToken, setScrambleToken] = useState(0);

  const targetLocale = locale === "en" ? "pt" : "en";
  const label = targetLocale.toUpperCase();

  const handleSwitch = () => {
    // Override the NEXT_LOCALE cookie so middleware respects the switch
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

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
  onMouseEnter={() => setScrambleToken((t) => t + 1)}
  onFocus={() => setScrambleToken((t) => t + 1)}
  className={cn(
    "fixed bottom-6 right-6 z-50 hidden md:flex",
    "h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80",
    "backdrop-blur-sm transition-all duration-300",
    "hover:border-accent/60 hover:text-accent",
    className,
  )}
  aria-label={`Mudar para ${targetLocale === "pt" ? "Português" : "Inglês"}`}
>
  {/* Certifique-se de que o ícone possui aria-hidden se for apenas decorativo */}
  <LanguagesIcon className="h-4 w-4" aria-hidden="true" />
</button>
  );
}
