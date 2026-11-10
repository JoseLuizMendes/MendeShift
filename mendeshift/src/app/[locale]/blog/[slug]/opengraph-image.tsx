import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getBlogPost, type Locale } from "@/lib/blog";

/** OG image por post — identidade do estúdio (dark + #ff4d4f) via next/og. */

export const alt = "MendeShift — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4d4f";
const BG = "#0a0a0b";
const MUTED = "#8a8a93";

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const result = getBlogPost(slug, locale as Locale);
  const post = result?.post;

  const fontsDir = join(process.cwd(), "src", "assets", "fonts");
  const [bebas, plexMono] = await Promise.all([
    readFile(join(fontsDir, "BebasNeue-Regular.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Regular.ttf")),
  ]);

  const tagline = post?.frontmatter.tags.map((t) => `#${t}`).join("  ") ?? "";

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
            {locale === "pt" ? "Artigo" : "Article"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Bebas Neue",
            fontSize: 108,
            lineHeight: 1.02,
            color: "#f5f5f7",
          }}
        >
          {post ? post.frontmatter.title : "MendeShift Blog"}
        </div>

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
              color: ACCENT,
            }}
          >
            {tagline}
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
