import { getServerTranslations } from "@/i18n/server";
import { whatsAppLink } from "@/lib/leads";
import { ContactChat } from "./contact-chat";
import { PortfolioCta } from "./portfolio-cta";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { Eyebrow, Section, SectionLead, SectionTitle } from "./ui/section";

export async function CtaSection({ locale }: { locale: string }) {
  const t = await getServerTranslations(locale, "contact");

  return (
    <Section id="contact" className="border-t border-border/30 py-10 md:py-14 xl:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("headline_1")} {t("headline_2")}</SectionTitle>
            <SectionLead>{t("availability")}</SectionLead>
          </div>
          <div className="flex flex-wrap gap-3">
            <PortfolioCta href="/contato" label={t("briefing_cta")} />
            <Button href={whatsAppLink()} variant="secondary">WhatsApp</Button>
          </div>
        </div>
        <ContactChat />
      </Container>
    </Section>
  );
}
