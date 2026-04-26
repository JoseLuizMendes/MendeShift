"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/context";
import { usePathname } from "next/navigation";

import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { cn } from "@/lib/utils";

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
        "fixed bottom-6 right-6 z-50",
        "flex h-10 items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4",
        "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-accent/60 hover:text-accent",
        className,
      )}
      aria-label={`Switch to ${targetLocale === "pt" ? "Portuguese" : "English"}`}
    >
      <span className="text-muted-foreground/40">{locale.toUpperCase()}</span>
      <span className="text-muted-foreground/25">/</span>
      <ScrambleTextOnHover
        text={label}
        as="span"
        duration={0.4}
        triggerToken={scrambleToken}
      />
    </button>
  );
}
