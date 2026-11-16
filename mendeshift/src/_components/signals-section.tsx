import { loadMessages } from "@/i18n/server";
import { MENDEBOT_HREF } from "@/lib/mendebot";
import { BitmapChevron } from "./bitmap-chevron";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Container } from "./ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "./ui/section";

type ServiceItem = { no: string; category: string; title: string; desc: string };

export async function SignalsSection({ locale }: { locale: string }) {
  const messages = await loadMessages(locale);
  const t = messages.services as { eyebrow: string; title: string; lead: string; link: string; addon: { label: string; text: string; link: string }; items: ServiceItem[] };

  return (
    <Section id="services" className="border-t border-border/30">
      <Container className="md:px-30">
        <div className="mb-8 sm:mb-12">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SectionTitle>{t.title}</SectionTitle>
          <SectionLead>{t.lead}</SectionLead>
        </div>
        <div className="signals-marquee">
          <div className="signals-marquee-track">
            {[false, true].map((duplicate) => (
              <div key={String(duplicate)} aria-hidden={duplicate || undefined} className="signals-marquee-group">
                {t.items.map((item) => (
                  <article key={item.no} className="group flex w-72 shrink-0 snap-start sm:w-80">
                    <Card className="relative flex min-h-69 flex-1 flex-col border-border/50 bg-card/80 p-6 transition-colors interaction-motion group-hover:border-accent/50 sm:min-h-75 sm:p-8">
                      <div className="mb-6 flex items-baseline justify-between gap-3">
                        <span className="portfolio-mono text-muted-foreground">{item.no}</span>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <h3 className="font-display text-3xl tracking-tight transition-colors interaction-motion group-hover:text-accent sm:text-4xl">{item.title}</h3>
                      <div className="mb-5 mt-4 h-px w-12 bg-accent/70 transition-[width] interaction-motion group-hover:w-full" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </Card>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center sm:mt-10">
          <Button href="/servicos" className="group min-h-11 max-w-full whitespace-normal border-accent/40">
            {t.link}
            <BitmapChevron className="transition-transform interaction-motion group-hover:rotate-45" />
          </Button>
        </div>
        <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 border-t border-border/30 pt-6 text-center text-sm text-muted-foreground">
          <span className="portfolio-mono text-accent">{t.addon.label}</span>
          <span>{t.addon.text}</span>
          <a
            href={MENDEBOT_HREF}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 transition-colors interaction-motion hover:text-accent focus-visible:text-accent sm:min-h-8"
          >
            {t.addon.link} <span aria-hidden="true">↗</span>
          </a>
        </p>
      </Container>
    </Section>
  );
}
