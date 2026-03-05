import { ColophonSection } from "@/components/colophon-section";
import { HeroSection } from "@/components/hero-section";
import { PrinciplesSection } from "@/components/principles-section";
import { SideNav } from "@/components/side-nav";
import { SignalsSection } from "@/components/signals-section";
import { WorkSection } from "@/components/work-section";

export default function Home() {
  return (
    <>
      <SideNav />
      <div className="noise-overlay" aria-hidden="true" />
      <main className="app-shell relative min-h-screen">
        <HeroSection />
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <ColophonSection />
      </main>
    </>
  );
}
