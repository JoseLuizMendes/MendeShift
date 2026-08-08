import { getServerTranslations } from "@/i18n/server";
import { getBlogPosts, type Locale } from "@/lib/blog";
import { getProjectsByLocale } from "@/lib/projects";

import { AboutSection } from "@/_components/about-section";
import { ColophonSection } from "@/_components/colophon-section";
import { CtaSection } from "@/_components/cta-section";
import { HeroSection } from "@/_components/hero-section";
import { PrinciplesSection } from "@/_components/principles-section";
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

  const recentPosts = getBlogPosts(locale as Locale).slice(0, 3);
  const tb = await getServerTranslations(locale, "blog");

  return (
    <>
      <SideNav />
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <HeroSection />
        <AboutSection />
        <SignalsSection />
        <WorkSection projects={projects} />
        <PrinciplesSection />
        <ProcessSection locale={locale} />
        <CtaSection />
        <RecentWritingSection
          posts={recentPosts}
          locale={locale as Locale}
          labels={{
            eyebrow: tb("recent_eyebrow"),
            title: tb("recent_title"),
            lead: tb("recent_lead"),
            cta: tb("recent_cta"),
            readMore: tb("read_more"),
          }}
        />
        <ColophonSection />
      </main>
    </>
  );
}
