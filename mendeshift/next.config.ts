import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
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
