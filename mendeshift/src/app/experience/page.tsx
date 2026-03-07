import type { Metadata } from "next";

import { ColophonSection } from "@/_components/colophon-section";
import { ExperienceSection } from "@/_components/experience-section";
import { ActionLink } from "@/_components/ui/action-link";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";

export const metadata: Metadata = {
  title: "Experiência | MendeShift",
  description:
    "Trajetória profissional e acadêmica de José Luiz Mendes em engenharia de software, sistemas públicos e qualidade de entrega.",
};

export default function ExperiencePage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main id="experience-page-top" className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-20 md:pt-28">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-2xl">
                <Eyebrow>Experiência / Depth</Eyebrow>
                <SectionTitle className="mt-4">Trajetória profissional e acadêmica</SectionTitle>
                <SectionLead>
                  O histórico fica aqui como camada de profundidade. A home continua vendendo execução,
                  qualidade de produto e capacidade de entrega.
                </SectionLead>
              </div>

              <div className="flex flex-wrap gap-3">
                <ActionLink href="/#work">Ver projetos</ActionLink>
                <ActionLink href="/" variant="ghost">
                  Voltar para home
                </ActionLink>
              </div>
            </div>
          </Container>
        </section>

        <ExperienceSection />
        <ColophonSection topHref="#experience-page-top" />
      </main>
    </>
  );
}