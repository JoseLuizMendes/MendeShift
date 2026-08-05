import type { NextConfig } from "next";

// Content-Security-Policy. Mantém 'unsafe-inline' em script/style porque o
// projeto usa scripts inline sem nonce (JSON-LD, bootstrap do Next) e o
// next/font injeta <style> inline; va.vercel-scripts.com cobre o Vercel
// Analytics/Speed Insights. Para endurecer depois: migrar para nonce via
// middleware e remover 'unsafe-inline'.
//
// 'unsafe-eval' só em dev: o React em modo desenvolvimento usa eval() para
// features de debug; em produção nunca usa. Sem isto, `next dev` quebra.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  isDev ? "'unsafe-eval'" : "",
]
  .filter(Boolean)
  .join(" ");

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Não expõe a stack (remove o header X-Powered-By).
  poweredByHeader: false,

  //Caso o Docker estivesse sendo usado:
  //output: "standalone",
  // Desabilita source maps em produção para proteger a lógica compilada
  //productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/projetos/spring-rest-api",
        destination: "/projetos/agendamento-api",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
