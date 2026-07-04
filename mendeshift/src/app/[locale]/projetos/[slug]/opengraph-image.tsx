import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getProjectBySlug, serviceAnchors } from "@/lib/projects";

/**
 * OG image por case (Fase 2 do PlanAgence) — título, categoria e metric
 * do projeto na identidade do estúdio (dark + #ff4d4f), via next/og.
 */

export const alt = "MendeShift — Case";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4d4f";
const BG = "#0a0a0b";
const MUTED = "#8a8a93";

const serviceLabels: Record<string, { pt: string; en: string }> = {
  "sites-e-landing-pages": { pt: "Sites & Landing Pages", en: "Websites & Landing Pages" },
  "sistemas-web": { pt: "Sistemas Web & SaaS", en: "Web Systems & SaaS" },
  ecommerce: { pt: "E-commerce", en: "E-commerce" },
  "design-e-branding": { pt: "Design & Identidade Visual", en: "Design & Branding" },
};

export default async function CaseOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug, locale);

  const fontsDir = join(process.cwd(), "src", "assets", "fonts");
  const [bebas, plexMono] = await Promise.all([
    readFile(join(fontsDir, "BebasNeue-Regular.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Regular.ttf")),
  ]);

  const anchor = project ? serviceAnchors[project.serviceType] : null;
  const serviceLabel = anchor
    ? serviceLabels[anchor]?.[locale === "pt" ? "pt" : "en"] ?? ""
    : "";

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
        {/* topo: estúdio + case label */}
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
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#f5f5f7",
              }}
            >
              MendeShift
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {locale === "pt" ? "Case" : "Case Study"}
          </span>
        </div>

        {/* centro: categoria + título + serviço */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {project && (
            <span
              style={{
                fontSize: 22,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {project.category}
            </span>
          )}
          <div
            style={{
              marginTop: 20,
              fontFamily: "Bebas Neue",
              fontSize: 130,
              lineHeight: 1,
              color: "#f5f5f7",
              display: "flex",
            }}
          >
            {project ? project.title : "MendeShift"}
          </div>
          {serviceLabel && (
            <span style={{ marginTop: 26, fontSize: 26, color: MUTED }}>
              {serviceLabel}
            </span>
          )}
        </div>

        {/* rodapé: metric + domínio */}
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
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: project?.metric ? ACCENT : MUTED,
            }}
          >
            {project?.metric ?? ""}
          </span>
          <span style={{ fontSize: 20, letterSpacing: "0.2em", color: MUTED }}>
            mendeshift.vercel.app
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
