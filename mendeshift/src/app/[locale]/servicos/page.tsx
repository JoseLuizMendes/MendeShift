import type { Metadata } from "next";

import { getServerTranslations, loadMessages } from "@/i18n/server";

import { BackToHomeLink } from "@/_components/back-to-home-link";
import { ColophonSection } from "@/_components/colophon-section";
import { FaqSection, type FaqItem } from "@/_components/faq-section";
import { ProcessSection } from "@/_components/process-section";
import { ServiceCard, type ServiceDetail } from "@/_components/service-card";
import { ActionLink } from "@/_components/ui/action-link";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead, SectionTitle } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  return {
    title: t("services_title"),
    description: t("services_desc"),
  };
}

type ServicesPageMessages = {
  eyebrow: string;
  title: string;
  lead: string;
  back: string;
  cta_briefing: string;
  deliverables_label: string;
  timeline_label: string;
  price_label: string;
  faq_title: string;
  items: ServiceDetail[];
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const t = messages.services_page as ServicesPageMessages;
  const faqItems = (messages.faq as { items: FaqItem[] }).items;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <section className="border-b border-border/20 pt-10 sm:pt-12 md:pt-8">
          <Container className="md:px-30">
            <div className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
              <div className="max-w-3xl">
                <Eyebrow>{t.eyebrow}</Eyebrow>
                <SectionTitle className="mt-4">{t.title}</SectionTitle>
                <SectionLead>{t.lead}</SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <BackToHomeLink className="w-full justify-center sm:w-auto">
                  {t.back}
                </BackToHomeLink>
                <ActionLink href="/contato" className="w-full justify-center sm:w-auto">
                  {t.cta_briefing}
                </ActionLink>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container className="md:px-30">
            <div className="space-y-8 md:space-y-12">
              {t.items.map((service) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  labels={{
                    deliverables: t.deliverables_label,
                    timeline: t.timeline_label,
                    price: t.price_label,
                    cta: t.cta_briefing,
                  }}
                />
              ))}
            </div>
          </Container>
        </section>

        <ProcessSection locale={locale} />

        <section className="pb-16 md:pb-24">
          <Container className="md:px-30">
            <FaqSection title={t.faq_title} items={faqItems} />
          </Container>
        </section>

        <ColophonSection />
      </main>
    </>
  );
}
