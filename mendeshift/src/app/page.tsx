import { AboutSection } from "@/_components/about-section";
import { ColophonSection } from "@/_components/colophon-section";
import { ExperienceSection } from "@/_components/experience-section";
import { HeroSection } from "@/_components/hero-section";
import { PrinciplesSection } from "@/_components/principles-section";
import { SideNav } from "@/_components/side-nav";
import { SignalsSection } from "@/_components/signals-section";
import { WorkSection } from "@/_components/work-section";

export default function Home() {
  return (
    <>
      <SideNav />
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <ColophonSection />
      </main>
    </>
  );
}
