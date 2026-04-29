import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TranslationsProvider } from "@/i18n/context";
import { notFound } from "next/navigation";
import { getServerTranslations, loadMessages } from "@/i18n/server";

import { LanguageToggle } from "@/_components/language-toggle";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale, "meta");

  return {
    metadataBase: new URL("https://mendeshift.vercel.app"),
    title: t("home_title"),
    description: t("home_desc"),
    openGraph: {
      title: t("home_title"),
      description: t("og_desc"),
      url: "https://mendeshift.vercel.app",
      siteName: "MendeShift",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: [
        {
          url: "/card_profile.webp",
          width: 1200,
          height: 630,
          alt: "José Luiz Mendes — Product Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("home_title"),
      description: t("twitter_desc"),
      images: ["/card_profile.webp"],
    },
    alternates: {
      canonical:
        locale === "en"
          ? "https://mendeshift.vercel.app"
          : `https://mendeshift.vercel.app/${locale}`,
      languages: {
        en: "https://mendeshift.vercel.app",
        pt: "https://mendeshift.vercel.app/pt",
      },
    },
  };
}

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
        <TranslationsProvider locale={locale} messages={messages}>
          <Preloader />
          <SmoothScroll>{children}</SmoothScroll>
          <LanguageToggle />
        </TranslationsProvider>
        <Analytics />
      </body>
    </html>
  );
}
