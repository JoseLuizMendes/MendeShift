export type Project = {
  slug: string;
  category: string;
  title: string;
  shortDesc: string;
  tech: string[];
  metric?: string;
  gridSpan: string;
  context: string;
  problem: string;
  constraints: string;
  solution: string;
  engineeringDecisions: string[];
  challenges: string[];
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "wedding-platform",
    category: "Full Stack",
    title: "Wedding Platform",
    shortDesc:
      "Plataforma completa para gestão do casamento — RSVP, pagamentos via Mercado Pago, galeria colaborativa e testes E2E.",
    tech: ["Next.js 15", "PostgreSQL", "Mercado Pago", "Playwright"],
    metric: "Entregue em produção — 07/09",
    gridSpan: "md:col-span-2 md:row-span-2",
    context:
      "Precisava gerenciar um casamento com ~200 convidados: confirmações de presença, controle de pagamentos e uma galeria de fotos colaborativa. Nenhuma ferramenta de mercado atendia aos requisitos de personalização e integração com gateway de pagamento brasileiro.",
    problem:
      "Construir do zero uma plataforma confiável para um evento com data fixa e zero tolerância a falhas — sem possibilidade de rollback no dia do evento.",
    constraints:
      "Prazo fixo (data do casamento), zero budget para infraestrutura cara, confiabilidade total exigida. Convidados sem conta precisavam confirmar presença e fazer upload de fotos.",
    solution:
      "Next.js 15 App Router com Server Components, PostgreSQL via Supabase com Row Level Security, integração com Mercado Pago para pagamentos e PIX, e Playwright para testes E2E cobrindo os fluxos críticos.",
    engineeringDecisions: [
      "Next.js App Router — SSR e API routes no mesmo projeto, reduz complexidade de deploy",
      "Supabase como BaaS — PostgreSQL com RLS elimina necessidade de backend separado",
      "Mercado Pago em vez de Stripe — cobertura de cartões nacionais e PIX",
      "Tokens temporários por QR Code — permite upload de fotos por convidados sem conta",
      "Playwright para E2E — cobre o fluxo crítico de confirmação de presença antes do evento",
    ],
    challenges: [
      "Idempotência em webhooks do Mercado Pago — implementei deduplicação por evento ID no banco",
      "Upload colaborativo sem autenticação — resolvi com tokens temporários de 24h gerados por QR Code",
      "Zero downtime durante o evento — deploy antecipado com feature flags e rollback testado",
    ],
    outcome:
      "Plataforma funcionou sem incidentes. 100% das confirmações processadas. Webhooks de pagamento confiáveis. O projeto mais completo do portfólio — produto real, entregue em produção, usado por pessoas reais.",
  },
  {
    slug: "barber-saas",
    category: "Product",
    title: "Barber SaaS",
    shortDesc:
      "Sistema de agendamento multi-tenant para barbearias — autenticação, isolamento de dados por tenant e deploy em produção com Docker.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Docker"],
    metric: "Multi-tenant em produção",
    gridSpan: "md:col-span-2 md:row-span-1",
    context:
      "Barbearias locais gerenciam agendamentos via WhatsApp e cadernos, perdendo controle e eficiência. Identifiquei a oportunidade de construir um SaaS leve, funcional e deployável em VPS de baixo custo.",
    problem:
      "Criar uma solução multi-tenant com isolamento real de dados entre barbearias, autenticação segura e interface simples o suficiente para donos sem experiência técnica.",
    constraints:
      "Deploy em VPS de baixo custo (sem Kubernetes), interface funcional em mobile, sem dependência de serviços pagos além do hosting.",
    solution:
      "Next.js com Prisma ORM e PostgreSQL, autenticação via NextAuth com credentials provider, isolamento de dados por tenantId em todas as queries, Docker Compose para paridade entre dev e produção.",
    engineeringDecisions: [
      "Row-level isolation em vez de schema-per-tenant — mais simples para o escopo atual",
      "Prisma ORM — type-safety nas queries e migrations versionadas",
      "Docker Compose — paridade entre ambiente de desenvolvimento e produção",
      "NextAuth com credentials provider — sem dependência de OAuth externo",
    ],
    challenges: [
      "Garantir isolamento completo entre tenants — auditei todas as queries do Prisma para confirmar filtro de tenantId",
      "Deploy em VPS sem Docker Hub — build local de imagens e transferência via SSH com SCP",
    ],
    outcome:
      "Sistema funcional em produção. Demonstra capacidade de pensar e executar um produto completo — do modelo de dados ao deploy — com decisões de arquitetura justificadas.",
  },
  {
    slug: "spring-rest-api",
    category: "Backend",
    title: "REST API",
    shortDesc:
      "API em Java/Spring Boot com arquitetura em camadas, autenticação JWT stateless e containerização com Docker.",
    tech: ["Java", "Spring Boot", "JWT", "Docker"],
    metric: "Arquitetura em camadas",
    gridSpan: "md:col-span-2 md:row-span-1",
    context:
      "Projeto de estudo aprofundado em arquitetura de APIs Java — tecnologia dominante nos sistemas governamentais onde atuo. Objetivo: consolidar padrões de produção com Spring Boot.",
    problem:
      "Construir uma API com padrões reais de produção: autenticação stateless, separação clara de responsabilidades, containerização e código testável por design.",
    constraints:
      "API deve ser stateless (JWT sem sessão server-side), containerização completa sem dependências de sistema operacional, código estruturado para testabilidade.",
    solution:
      "Arquitetura em camadas (Controller → Service → Repository), Spring Security com JWT para autenticação stateless, Hibernate para ORM e Docker multi-stage build para imagem de produção.",
    engineeringDecisions: [
      "Arquitetura em camadas — separação clara de responsabilidades e testabilidade por design",
      "JWT stateless — sem store de sessão, escala horizontalmente sem coordenação",
      "Spring Security — autenticação battle-tested em vez de implementação manual",
      "Docker multi-stage build — imagem de produção leve sem ferramentas de build",
    ],
    challenges: [
      "Configurar Spring Security para proteger endpoints autenticados sem bloquear rotas públicas",
      "Gerenciar expiração e renovação de tokens JWT de forma segura e previsível",
    ],
    outcome:
      "API funcional com documentação. Consolidou conhecimento em arquitetura de sistemas Java — lógica diretamente aplicável ao trabalho com sistemas governamentais em C#/.NET.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
