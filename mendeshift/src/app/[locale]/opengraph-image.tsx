import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * OG image da agência (dark + accent #ff4d4f), gerada com next/og.
 * Substitui o card pessoal da era portfólio. A mesma infraestrutura
 * (fontes em src/assets/fonts) serve para o OG por case na Fase 2.
 */

export const alt = "MendeShift — Estúdio Digital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4d4f";
const BG = "#0a0a0b";
const MUTED = "#8a8a93";

const taglines: Record<string, { studio: string; line: string; location: string }> = {
  pt: {
    studio: "Estúdio Digital",
    line: "Sites, sistemas e e-commerces que transformam presença digital em resultado.",
    location: "Vitória, ES — Brasil",
  },
  en: {
    studio: "Digital Studio",
    line: "Websites, systems and e-commerce that turn digital presence into results.",
    location: "Vitória, Brazil",
  },
};

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = taglines[locale] ?? taglines.pt;

  const fontsDir = join(process.cwd(), "src", "assets", "fonts");
  const [bebas, plexMono] = await Promise.all([
    readFile(join(fontsDir, "BebasNeue-Regular.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          padding: "64px 72px",
          fontFamily: "IBM Plex Mono",
        }}
      >
        {/* topo: marcador + studio label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 14, height: 14, backgroundColor: ACCENT }} />
            <span
              style={{
                fontSize: 22,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {t.studio}
            </span>
          </div>
          <span style={{ fontSize: 20, letterSpacing: "0.2em", color: MUTED }}>
            mendeshift.vercel.app
          </span>
        </div>

        {/* centro: wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Bebas Neue",
              fontSize: 176,
              lineHeight: 1,
              color: "#f5f5f7",
              display: "flex",
            }}
          >
            <span>MENDESHIFT</span>
            <span style={{ color: ACCENT }}>.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              width: 120,
              height: 4,
              backgroundColor: ACCENT,
              display: "flex",
            }}
          />
          <span
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.5,
              color: MUTED,
              maxWidth: 900,
            }}
          >
            {t.line}
          </span>
        </div>

        {/* rodapé: localização */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {t.location}
          </span>
          <span style={{ fontSize: 20, letterSpacing: "0.25em", color: ACCENT }}>
            {"</>"}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bebas Neue", data: bebas, style: "normal", weight: 400 },
        { name: "IBM Plex Mono", data: plexMono, style: "normal", weight: 400 },
      ],
    },
  );
}
