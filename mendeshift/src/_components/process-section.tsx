import { loadMessages } from "@/i18n/server";

import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "@/_components/ui/section";

type ProcessStep = {
  no: string;
  title: string;
  desc: string;
};

type ProcessMessages = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: ProcessStep[];
};

/**
 * Linha do tempo do processo (Briefing → Suporte).
 * Server component: sem GSAP — transições CSS dão conta da interação.
 */
export async function ProcessSection({ locale }: { locale: string }) {
  const messages = await loadMessages(locale);
  const t = messages.process as ProcessMessages;

  return (
    <Section id="process" className="relative">
      <Container className="md:px-30">
        <div className="mb-12 md:mb-16">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SectionTitle>{t.title}</SectionTitle>
          <SectionLead>{t.lead}</SectionLead>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {t.steps.map((step) => (
            <li key={step.no} className="group">
              <Card className="flex h-full flex-col gap-4 border-border/50 bg-card/60 p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {step.no}
                  </span>
                  <span className="h-px w-10 bg-accent/60 transition-all duration-500 group-hover:w-16" />
                </div>
                <h3 className="font-display text-2xl tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                  {step.title}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
