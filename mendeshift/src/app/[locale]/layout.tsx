import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { pickClientMessages } from "@/i18n/client-namespaces";
import { TranslationsProvider } from "@/i18n/context";
import { notFound } from "next/navigation";
import { getServerTranslations, loadMessages } from "@/i18n/server";
import { SITE_URL, localizedUrl, pageMetadata } from "@/lib/metadata";

import { AnalyticsEvents } from "@/_components/analytics-events";
import { PortfolioHeader } from "@/_components/portfolio-shell";
import { SkipLink } from "@/_components/skip-link";
import { SmoothScroll } from "@/_components/smooth-scroll";
import "../globals.css";
import "../portfolio.css";

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
      url: localizedUrl(locale),
      siteName: "MendeShift",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      // og:image vem do file-based opengraph-image.tsx deste segmento
      // (imagem via next/og), que tem precedência sobre config.
    },
    twitter: {
      card: "summary_large_image",
      title: t("home_title"),
      description: t("twitter_desc"),
    },
  };
}

/**
 * JSON-LD da identidade do estúdio: ProfessionalService + fundador (Person)
 * + WebSite, ligados por @id para buscadores e assistentes de IA resolverem
 * "MendeShift" e "José Luiz Mendes" como a mesma entidade em todas as páginas.
 * makesOffer espelha os 4 serviços de messages/{pt,en}.json (services.items).
 */
function siteJsonLd(locale: string, description: string, services: string[]) {
  const home = localizedUrl(locale);
  const founderId = `${SITE_URL}/#founder`;
  const studioId = `${SITE_URL}/#studio`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": studioId,
        name: "MendeShift",
        description,
        url: home,
        logo: `${SITE_URL}/icon.svg`,
        // Com o locale explícito: é a rota real da imagem, sem redirect.
        image: `${SITE_URL}/${locale}/opengraph-image`,
        telephone: "+55 27 99630-0333",
        email: "josemendess004@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vitória",
          addressRegion: "ES",
          addressCountry: "BR",
        },
        areaServed: { "@type": "Country", name: "Brasil" },
        availableLanguage: ["pt-BR", "en"],
        founder: { "@id": founderId },
        sameAs: [
          "https://github.com/JoseLuizMendes",
          "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
          "https://www.instagram.com/mendeshift",
          "https://www.tiktok.com/@mendeshift",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+55 27 99630-0333",
          email: "josemendess004@gmail.com",
          url: "https://wa.me/5527996300333",
          availableLanguage: ["pt-BR", "en"],
        },
        makesOffer: services.map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
      {
        "@type": "Person",
        "@id": founderId,
        name: "José Luiz Mendes",
        jobTitle: "Software Engineer",
        url: `${home}/experience`,
        worksFor: { "@id": studioId },
        sameAs: [
          "https://github.com/JoseLuizMendes",
          "https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "MendeShift",
        url: home,
        inLanguage: locale === "pt" ? "pt-BR" : "en",
        publisher: { "@id": studioId },
      },
    ],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!["en", "pt"].includes(locale)) {
    notFound();
  }

  const messages = await loadMessages(locale);
  const jsonLd = siteJsonLd(
    locale,
    (messages.meta as { home_desc: string }).home_desc,
    (messages.services as { items: { title: string }[] }).items.map((item) => item.title),
  );

  return (
    <html lang={locale} className="dark">
      <body
        className={`${primarySans.variable} ${primaryMono.variable} ${display.variable} bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TranslationsProvider locale={locale} messages={pickClientMessages(messages)}>
          <div className="portfolio-grain" aria-hidden="true" />
          <SkipLink />
          <SmoothScroll>
            <PortfolioHeader locale={locale} />
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
            <AnalyticsEvents />
            <Analytics/>
            <SpeedInsights/>
          </SmoothScroll>
        </TranslationsProvider>
      </body>
    </html>
  );
}
