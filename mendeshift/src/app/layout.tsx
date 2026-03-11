import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { SmoothScroll } from "@/_components/smooth-scroll";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://mendeshift.vercel.app"),
  title: "José Luiz Mendes — Product Engineer",
  description:
    "Product Engineer em Vitória, ES. Construo aplicações web fullstack, APIs e sistemas orientados a produto — do modelo de dados à experiência do usuário final.",
  openGraph: {
    title: "José Luiz Mendes — Product Engineer",
    description:
      "Product Engineer em Vitória, ES. Aplicações web fullstack, APIs e sistemas orientados a produto — do modelo de dados à experiência do usuário final.",
    url: "https://mendeshift.vercel.app",
    siteName: "MendeShift",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/Card_Profissional.png",
        width: 1200,
        height: 630,
        alt: "José Luiz Mendes — Product Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "José Luiz Mendes — Product Engineer",
    description:
      "Product Engineer em Vitória, ES. Aplicações web fullstack, APIs e sistemas orientados a produto.",
    images: ["/Card_Profissional.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${primarySans.variable} ${primaryMono.variable} ${display.variable} bg-background text-foreground antialiased`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
