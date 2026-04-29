import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  //Caso o Docker estivesse sendo usado:
  //output: "standalone",
  // Desabilita source maps em produção para proteger a lógica compilada
  //productionBrowserSourceMaps: false,

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
