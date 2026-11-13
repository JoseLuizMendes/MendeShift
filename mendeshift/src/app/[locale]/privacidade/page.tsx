import type { Metadata } from "next";

import { pageMetadata } from "@/lib/metadata";
import { PRIVACY_CONTACT_EMAIL, getPrivacyContent } from "@/lib/privacy";

import { ColophonSection } from "@/_components/colophon-section";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = getPrivacyContent(locale);
  return pageMetadata({
    locale,
    path: "/privacidade",
    title: `${content.title} | MendeShift`,
    description: content.lead,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const content = getPrivacyContent(locale);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <section className="border-b border-border/20">
          <Container className="md:px-30">
            <div className="max-w-3xl py-8 md:py-12">
              <Eyebrow>{content.eyebrow}</Eyebrow>
              <h1 className="portfolio-display mt-4">{content.title}</h1>
              <SectionLead>{content.lead}</SectionLead>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {content.updatedLabel}: {content.updatedAt}
              </p>
            </div>
          </Container>
        </section>

        <section className="py-10 md:py-16">
          <Container className="md:px-30">
            <div className="max-w-3xl space-y-10">
              {content.blocks.map((block) => (
                <section key={block.heading}>
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{block.heading}</h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {block.items && (
                      <ul className="list-disc space-y-3 pl-5 marker:text-accent">
                        {block.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                  </div>
                </section>
              ))}

              <section className="border border-border/60 bg-card/60 p-5 sm:p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {content.contactLabel}
                </h2>
                <a
                  href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
                  className="mt-3 inline-flex min-h-11 items-center text-base text-foreground underline decoration-accent underline-offset-4 transition-colors interaction-motion hover:text-accent"
                >
                  {PRIVACY_CONTACT_EMAIL}
                </a>
              </section>
            </div>
          </Container>
        </section>

        <ColophonSection />
      </main>
    </>
  );
}
