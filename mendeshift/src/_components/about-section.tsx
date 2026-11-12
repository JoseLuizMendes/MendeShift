import { getServerTranslations } from "@/i18n/server";
import { localeHref } from "@/lib/navigation";
import { ShaderImage } from "./shader-image";
import { PortfolioCta } from "./portfolio-cta";
import { Container } from "./ui/container";
import { Eyebrow, Section, SectionTitle } from "./ui/section";

export async function AboutSection({ locale }: { locale: string }) {
  const t = await getServerTranslations(locale, "studio_editorial");

  return (
    <Section id="about" className="studio-section">
      <ShaderImage
        className="studio-backdrop"
        src="/portfolio/studio-developer.webp"
        wardrobeSrc="/portfolio/studio-founder.webp"
        alt=""
        sizes="(max-width: 320px) 445px, (max-width: 760px) 150vw, (max-width: 1100px) 100vw, 92vw"
        loading="eager"
        position={0.76}
        trackParent
      />

      <Container className="studio-content relative z-10 md:px-20">
        <div className="studio-copy">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
          <p>{t("intro")}</p>
          <span className="studio-reveal-hint portfolio-mono">{t("wardrobe_hint")}</span>
          <dl className="studio-meta portfolio-mono">
            <div><dt>{t("base_label")}</dt><dd>Vitória, ES · Brasil</dd></div>
            <div><dt>{t("practice_label")}</dt><dd>{t("practice")}</dd></div>
          </dl>
          <PortfolioCta href={localeHref("/experience", locale)} label={t("profile")} className="w-fit max-w-full" />
        </div>
      </Container>
      <span className="shader-touch-hint portfolio-mono" aria-hidden="true">
        {t("touch_hint")} <span className="text-accent">+</span>
      </span>
    </Section>
  );
}
