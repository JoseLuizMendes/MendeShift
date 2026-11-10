import Image from "next/image";
import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";
import { localeHref } from "@/lib/navigation";
import { Container } from "./ui/container";
import { Eyebrow, Section, SectionTitle } from "./ui/section";

export async function AboutSection({ locale }: { locale: string }) {
  const t = await getServerTranslations(locale, "studio_editorial");

  return (
    <Section id="about" className="studio-section border-t border-border/30">
      <div className="studio-backdrop">
        <Image
          src="/portfolio/studio-portrait.webp"
          alt={t("portrait")}
          width={1402}
          height={1122}
          sizes="(max-width: 760px) 100vw, 60vw"
        />
      </div>

      <Container className="relative z-10 md:px-20">
        <div className="studio-copy">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
          <p>{t("intro")}</p>
          <dl className="studio-meta portfolio-mono">
            <div><dt>{t("base_label")}</dt><dd>Vitória, ES · Brasil</dd></div>
            <div><dt>{t("practice_label")}</dt><dd>{t("practice")}</dd></div>
          </dl>
          <Link className="portfolio-text-link" href={localeHref("/experience", locale)}>
            {t("profile")} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
