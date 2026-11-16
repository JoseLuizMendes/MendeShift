import { Check } from "lucide-react";

import { MENDEBOT_HREF } from "@/lib/mendebot";

import { Button } from "@/_components/ui/button";
import { Card } from "@/_components/ui/card";

export type AddonDetail = {
  slug: string;
  label: string;
  category: string;
  title: string;
  desc: string;
  case_note: string;
  deliverables: string[];
  cta_site: string;
};

/**
 * Serviço adicional na página /servicos. Fica fora da lista dos quatro
 * serviços porque tem site próprio: o CTA principal leva ao MendeBot.
 */
export function AddonCard({
  addon,
  labels,
}: {
  addon: AddonDetail;
  labels: { deliverables: string; cta: string };
}) {
  return (
    <article id={addon.slug} className="scroll-mt-24">
      <Card className="border-accent/40 bg-card/60 p-4 sm:p-8 md:p-10">
        <div className="mb-6 flex items-baseline justify-between sm:mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {addon.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {addon.category}
          </span>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
              {addon.title}
            </h2>
            <div className="mb-6 mt-4 h-px w-16 bg-accent/70" />
            <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              {addon.desc}
            </p>
            <p className="mt-4 max-w-xl border-l border-accent/50 pl-4 font-mono text-xs leading-relaxed text-foreground/90">
              {addon.case_note}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={MENDEBOT_HREF}
                variant="primary"
                target="_blank"
                rel="noopener"
                className="min-h-11 w-full sm:w-auto"
              >
                {addon.cta_site} <span aria-hidden="true">↗</span>
              </Button>
              <Button href="/contato" className="min-h-11 w-full justify-center sm:w-auto">
                {labels.cta}
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {labels.deliverables}
            </p>
            <ul className="space-y-3">
              {addon.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-accent/40 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="font-mono text-xs leading-relaxed text-foreground/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </article>
  );
}
