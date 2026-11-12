import { getServerTranslations } from "@/i18n/server";
import { getBlogPosts, type Locale } from "@/lib/blog";
import { getProjectsByLocale } from "@/lib/projects";

import { AboutSection } from "@/_components/about-section";
import { ColophonSection } from "@/_components/colophon-section";
import { CtaSection } from "@/_components/cta-section";
import { HeroSection } from "@/_components/hero-section";
import { ProcessSection } from "@/_components/process-section";
import { RecentWritingSection } from "@/_components/recent-writing-section";
import { SideNav } from "@/_components/side-nav";
import { SignalsSection } from "@/_components/signals-section";
import { WorkSection } from "@/_components/work-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const projects = getProjectsByLocale(locale);

  const recentPosts = getBlogPosts(locale as Locale).slice(0, 1);
  const tb = await getServerTranslations(locale, "blog");

  return (
    <>
      <SideNav />
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <HeroSection />
        <WorkSection projects={projects} locale={locale} />
        <AboutSection locale={locale} />
        <SignalsSection locale={locale} />
        <ProcessSection locale={locale} />
        <CtaSection locale={locale} />
        <RecentWritingSection
          posts={recentPosts}
          locale={locale as Locale}
          title={tb("recent_title")}
        />
        <ColophonSection showProjectCta={false} />
      </main>
    </>
  );
}
