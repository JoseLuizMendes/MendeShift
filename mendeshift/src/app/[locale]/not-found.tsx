"use client";

import { useLocale } from "@/i18n/context";
import { PortfolioCta } from "@/_components/portfolio-cta";
import { Container } from "@/_components/ui/container";

export default function NotFound() {
  const isPortuguese = useLocale() === "pt";

  return (
    <main className="app-shell grid min-h-[70svh] items-center py-12">
      <Container>
        <p className="portfolio-mono text-accent">404</p>
        <h1 className="portfolio-display mt-4 max-w-2xl">
          {isPortuguese ? "Página não encontrada" : "Page not found"}<span className="text-accent">.</span>
        </h1>
        <p className="portfolio-lead mt-5">
          {isPortuguese ? "Este endereço pode ter mudado." : "This address may have changed."}
        </p>
        <PortfolioCta className="mt-7 w-fit" href="/" label={isPortuguese ? "Voltar ao início" : "Back to home"} />
      </Container>
    </main>
  );
}
