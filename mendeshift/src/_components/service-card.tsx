import { Check } from "lucide-react";

import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";

export type ServiceDetail = {
  slug: string;
  no: string;
  category: string;
  title: string;
  desc: string;
  deliverables: string[];
  timeline: string;
  price: string;
};

export type ServiceCardLabels = {
  deliverables: string;
  timeline: string;
  price: string;
  cta: string;
};

/**
 * Bloco de detalhe de um serviço na página /servicos.
 * O id = slug permite deep-link por âncora (ex.: /servicos#ecommerce).
 */
export function ServiceCard({
  service,
  labels,
}: {
  service: ServiceDetail;
  labels: ServiceCardLabels;
}) {
  return (
    <article id={service.slug} className="scroll-mt-24">
      <Card className="border-border/50 bg-card/60 p-6 sm:p-8 md:p-10">
        <div className="mb-6 flex items-baseline justify-between sm:mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {service.no}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {service.category}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
              {service.title}
            </h2>
            <div className="mb-6 mt-4 h-px w-16 bg-accent/70" />
            <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              {service.desc}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-background/40 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {labels.timeline}
                </dt>
                <dd className="mt-2 font-mono text-sm text-foreground">
                  {service.timeline}
                </dd>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/40 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {labels.price}
                </dt>
                <dd className="mt-2 font-mono text-sm text-foreground">
                  {service.price}
                </dd>
              </div>
            </dl>

            <ActionLink href="/contato" className="mt-8">
              {labels.cta}
            </ActionLink>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {labels.deliverables}
            </p>
            <ul className="space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
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
