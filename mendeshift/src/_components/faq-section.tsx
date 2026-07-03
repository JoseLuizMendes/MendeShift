import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

/**
 * Accordion de FAQ com <details> nativo — acessível por padrão, sem JS.
 * O conteúdo espelha o JSON-LD FAQPage renderizado pela página que o usa.
 */
export function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <div>
      <h2 className="mb-8 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group overflow-hidden rounded-2xl border border-border/50 bg-card/30 transition-colors duration-300 open:border-accent/50 open:bg-card/60 hover:border-accent/35"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-sm font-medium text-foreground transition-colors duration-200 group-open:text-accent">
                {item.q}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform duration-300 group-open:rotate-180 group-open:text-accent/70" />
            </summary>
            <p className="border-t border-border/40 px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
