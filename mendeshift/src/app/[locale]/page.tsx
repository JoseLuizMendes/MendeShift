import { getProjectsByLocale } from "@/lib/projects";

import { AboutSection } from "@/_components/about-section";
import { ColophonSection } from "@/_components/colophon-section";
import { CtaSection } from "@/_components/cta-section";
import { HeroSection } from "@/_components/hero-section";
import { PrinciplesSection } from "@/_components/principles-section";
import { SideNav } from "@/_components/side-nav";
import { SignalsSection } from "@/_components/signals-section";
import { WorkSection } from "@/_components/work-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const projects = getProjectsByLocale(locale);

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
        <CtaSection />
        <ColophonSection />
      </main>
    </>
  );
}
