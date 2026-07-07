import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { TranslationsProvider } from "@/i18n/context";
import { notFound } from "next/navigation";
import { getServerTranslations, loadMessages } from "@/i18n/server";
import { SITE_URL, pageMetadata } from "@/lib/metadata";

import { LanguageToggle } from "@/_components/language-toggle";
import { MobileNav } from "@/_components/mobile-nav";
import { Preloader } from "@/_components/preloader";
import { SmoothScroll } from "@/_components/smooth-scroll";
import "../globals.css";

const primarySans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const primaryMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Pré-renderiza os dois locales: sem isto, todas as páginas sob [locale]
// renderizam dinamicamente (função por request em vez de estático no CDN).
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");

  return {
    metadataBase: new URL(SITE_URL),
    // Metadata da home; subpáginas definem as próprias via pageMetadata()
    // (src/lib/metadata.ts) — sem isso herdariam o canonical da home.
    ...pageMetadata({
      locale,
      path: "",
      title: t("home_title"),
      description: t("home_desc"),
    }),
    openGraph: {
      title: t("home_title"),
      description: t("og_desc"),
      url: locale === "pt" ? `${SITE_URL}/pt` : SITE_URL,
      siteName: "MendeShift",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      // og:image vem do file-based opengraph-image.tsx deste segmento
      // (imagem de agência via next/og), que tem precedência sobre config.
    },
    twitter: {
      card: "summary_large_image",
      title: t("home_title"),
      description: t("twitter_desc"),
    },
  };
}

/**
 * JSON-LD ProfessionalService — identidade da agência para buscadores.
 * makesOffer espelha os 4 serviços de messages/{pt,en}.json (services.items).
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "MendeShift",
  description:
    "Estúdio digital em Vitória, ES: criação de sites e landing pages, sistemas web sob medida, e-commerce e identidade visual.",
  url: SITE_URL,
  image: `${SITE_URL}/pt/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vitória",
    addressRegion: "ES",
    addressCountry: "BR",
  },
  areaServed: "BR",
  founder: {
    "@type": "Person",
    name: "José Luiz Mendes",
    jobTitle: "Software Engineer",
  },
  sameAs: [
    "https://github.com/JoseLuizMendes",
    "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "josemendess004@gmail.com",
    url: "https://wa.me/5527996300333",
  },
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sites & Landing Pages" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sistemas Web & SaaS" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-commerce" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Design & Identidade Visual" } },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!["en", "pt"].includes(locale)) {
    notFound();
  }

  const messages = await loadMessages(locale);

  return (
    <html lang={locale} className="dark">
      <body
        className={`${primarySans.variable} ${primaryMono.variable} ${display.variable} bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <TranslationsProvider locale={locale} messages={messages}>
          <Preloader />
          <SmoothScroll>{children}
          <Analytics/>
          <SpeedInsights/>
          </SmoothScroll>
          <LanguageToggle />
          <MobileNav />
        </TranslationsProvider>
      </body>
    </html>
  );
}
