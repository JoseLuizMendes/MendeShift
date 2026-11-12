import { loadMessages } from "@/i18n/server";

import { Container } from "@/_components/ui/container";
import { ProcessPuzzle } from "@/_components/process-puzzle";
import { ProcessPieceShape } from "@/_components/process-piece-shape";
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

export async function ProcessSection({ locale }: { locale: string }) {
  const messages = await loadMessages(locale);
  const t = messages.process as ProcessMessages;

  return (
    <Section id="process" className="relative overflow-clip py-12 md:py-18 xl:py-20">
      <Container className="md:px-30">
        <div className="mb-8 md:mb-10">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <SectionTitle>{t.title}</SectionTitle>
          <SectionLead>{t.lead}</SectionLead>
        </div>

        <ProcessPuzzle>
          {t.steps.map((step, index) => (
            <li key={step.no} className="process-piece">
              <div className="process-piece-face group">
                <ProcessPieceShape index={index} count={t.steps.length} />
                <div className="process-piece-content">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {step.no}
                    </span>
                    <span className="h-px w-10 bg-accent/55 transition-colors interaction-motion group-hover:bg-accent" />
                  </div>
                  <h3 className="font-display text-2xl tracking-tight transition-colors interaction-motion group-hover:text-accent sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ProcessPuzzle>
      </Container>
    </Section>
  );
}
