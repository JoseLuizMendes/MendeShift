import type { Metadata } from "next";
import { Linkedin, Mail, MessageCircle } from "lucide-react";

import { getServerTranslations, loadMessages } from "@/i18n/server";
import { whatsAppLink } from "@/lib/leads";
import { pageMetadata } from "@/lib/metadata";

import { BriefingForm } from "@/_components/briefing-form";
import { ColophonSection } from "@/_components/colophon-section";
import { Button } from "@/_components/ui/button";
import { Container } from "@/_components/ui/container";
import { Eyebrow, SectionLead } from "@/_components/ui/section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");
  return pageMetadata({
    locale,
    path: "/contato",
    title: t("contact_title"),
    description: t("contact_desc"),
  });
}

type ContactPageMessages = {
  eyebrow: string;
  title: string;
  lead: string;
  back: string;
  direct_label: string;
  direct_text: string;
  cta_fill: string;
};

const directLinks = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: whatsAppLink(),
    icon: MessageCircle,
  },
  {
    key: "email",
    label: "E-mail",
    href: "mailto:josemendess004@gmail.com",
    icon: Mail,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
    icon: Linkedin,
  },
];

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const t = messages.contact_page as unknown as ContactPageMessages;

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <section className="border-b border-border/20">
          <Container className="md:px-30">
            <div className="flex flex-col gap-4 py-8 md:flex-row md:items-end md:justify-between md:py-12">
              <div className="max-w-3xl">
                <Eyebrow>{t.eyebrow}</Eyebrow>
                <h1 className="portfolio-display mt-4">{t.title}</h1>
                <SectionLead>{t.lead}</SectionLead>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <Button href="#briefing" variant="primary">{t.cta_fill}</Button>
                <Button href={whatsAppLink()} variant="secondary">WhatsApp</Button>
              </div>
            </div>
          </Container>
        </section>

        <section id="briefing" className="scroll-mt-6 py-6 md:py-10">
          <Container className="md:px-30">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,22rem)] lg:items-start">
              <BriefingForm />

              <aside className="flex flex-col gap-4 border border-border/60 bg-card/60 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {t.direct_label}
                </p>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {t.direct_text}
                </p>
                <div className="flex flex-col gap-2.5">
                  {directLinks.map(({ key, label, href, icon: Icon }) => (
                    <Button
                      key={key}
                      href={href}
                      variant="secondary"
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="group h-14 w-full justify-between border border-border/60 bg-background/35 px-3 text-[11px] tracking-[0.22em] text-foreground transition-all interaction-motion hover:border-accent/70 hover:bg-accent/5 hover:text-accent"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center border border-border/60 bg-card/80 text-muted-foreground transition-colors interaction-motion group-hover:border-accent/70 group-hover:text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        {label}
                      </span>
                    </Button>
                  ))}
                </div>
              </aside>
            </div>
          </Container>
        </section>

        <ColophonSection />
      </main>
    </>
  );
}
