export type Project = {
  slug: string;
  category: string;
  title: string;
  shortDesc: string;
  tech: string[];
  metric?: string;
  gridSpan: string;
  placeholderLabel: string;
  placeholderCaption: string;
  accentGradient: string;
  /**
   * Caminho relativo a /public para o screenshot do projeto.
   * Ex: "/projects/wedding-platform.webp"
   * Recomendação: 1200×675px, salvo como .webp.
   * Quando presente, substitui o gradiente no preview do card.
   * Quando ausente, usa accentGradient como fallback.
   */
  previewImage?: string;
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
    placeholderLabel: "EVENT STACK",
    placeholderCaption: "Fluxos críticos, pagamentos e colaboração em tempo real.",
    accentGradient: "bg-linear-to-br from-accent/10 to-transparent",
    previewImage: "/projects/wedding-platform.webp",
    context:
      "Precisava gerenciar um casamento com ~200 convidados: confirmações de presença, controle de pagamentos e uma galeria de fotos colaborativa. Nenhuma ferramenta de mercado atendia aos requisitos de personalização e integração com gateway de pagamento brasileiro. O projeto nasceu como necessidade pessoal e virou o laboratório mais intenso de engenharia que tive.",
    problem:
      "Construir do zero uma plataforma confiável para um evento com data fixa e zero tolerância a falhas — sem possibilidade de rollback no dia do evento. Qualquer bug em produção impactaria convidados reais e o evento em si.",
    constraints:
      "Prazo fixo (data do casamento em 07/09), zero budget para infraestrutura cara, confiabilidade total exigida. Convidados sem conta precisavam confirmar presença e fazer upload de fotos. A plataforma precisava funcionar em dispositivos variados, de smartphones antigos a desktops.",
    solution:
      "Next.js 15 App Router com Server Components para SSR otimizado, PostgreSQL via Supabase com Row Level Security para isolar dados por convidado, integração com Mercado Pago (cartão + PIX) para pagamentos, e Playwright para testes E2E cobrindo os fluxos críticos de RSVP e checkout.",
    engineeringDecisions: [
      "Next.js App Router — SSR e API routes no mesmo projeto, reduz complexidade de deploy e mantém SEO",
      "Supabase como BaaS — PostgreSQL com RLS elimina necessidade de backend separado, com real-time para galeria",
      "Mercado Pago em vez de Stripe — cobertura completa de cartões nacionais, boleto e PIX instantâneo",
      "Tokens temporários por QR Code — permite upload de fotos por convidados sem conta, com expiração de 24h",
      "Playwright para E2E — cobre o fluxo crítico de confirmação de presença antes do evento, rodando em CI",
    ],
    challenges: [
      "Idempotência em webhooks do Mercado Pago — implementei deduplicação por evento ID no banco, evitando cobranças duplicadas",
      "Upload colaborativo sem autenticação — resolvi com tokens temporários de 24h gerados por QR Code impresso nos convites",
      "Zero downtime durante o evento — deploy antecipado com feature flags, rollback testado e monitoramento ativo",
    ],
    outcome:
      "Plataforma funcionou sem incidentes durante todo o evento. 100% das confirmações processadas, pagamentos via PIX e cartão sem falhas. Galeria colaborativa com uploads de dezenas de convidados. O projeto mais completo do portfólio — produto real, entregue em produção, usado por pessoas reais.",
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
    placeholderLabel: "OPS GRID",
    placeholderCaption: "Agenda, serviços e isolamento de dados por tenant.",
    accentGradient: "bg-linear-to-tl from-foreground/8 to-transparent",
    previewImage: "/projects/barber-saas.webp",
    context:
      "Barbearias locais gerenciam agendamentos via WhatsApp e cadernos, perdendo controle, horários e eficiência. Após conversar com donos de barbearias na região, identifiquei a oportunidade de construir um SaaS leve, funcional e deployável em VPS de baixo custo — sem a complexidade de plataformas enterprise.",
    problem:
      "Criar uma solução multi-tenant com isolamento real de dados entre barbearias, autenticação segura e interface simples o suficiente para donos sem experiência técnica. O sistema precisava funcionar bem em celulares baratos, que é o device principal dos barbeiros.",
    constraints:
      "Deploy em VPS de baixo custo (sem Kubernetes), interface funcional em mobile-first, sem dependência de serviços pagos além do hosting. O onboarding de novos tenants precisava ser autoatendimento.",
    solution:
      "Next.js com Prisma ORM e PostgreSQL, autenticação via NextAuth com credentials provider, isolamento de dados por tenantId em todas as queries, Docker Compose para paridade entre dev e produção. Interface mobile-first com fluxo de agendamento em 3 taps.",
    engineeringDecisions: [
      "Row-level isolation em vez de schema-per-tenant — mais simples para o escopo atual e escala previsível",
      "Prisma ORM — type-safety nas queries, migrations versionadas e introspecção do schema",
      "Docker Compose — paridade total entre ambiente de desenvolvimento e produção",
      "NextAuth com credentials provider — sem dependência de OAuth externo, adequado para público sem Google/GitHub",
    ],
    challenges: [
      "Garantir isolamento completo entre tenants — auditei todas as queries do Prisma para confirmar filtro consistente de tenantId",
      "Deploy em VPS sem Docker Hub — build local de imagens e transferência via SSH com SCP",
      "Interface para público não-técnico — ciclos de feedback com barbeiros reais para simplificar o fluxo",
    ],
    outcome:
      "Sistema funcional em produção com múltiplos tenants. Demonstra capacidade de pensar e executar um produto completo — do modelo de dados ao deploy — com decisões de arquitetura justificadas e validadas com usuários reais.",
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
    placeholderLabel: "SERVICE CORE",
    placeholderCaption: "Segurança stateless, camadas claras e deploy enxuto.",
    accentGradient: "bg-linear-to-b from-muted-foreground/12 to-transparent",
    previewImage: "/projects/spring-rest-api.webp",
    context:
      "Projeto de estudo aprofundado em arquitetura de APIs Java — tecnologia dominante nos sistemas governamentais onde atuo no PRODEST. Objetivo: consolidar padrões de produção com Spring Boot e aplicar os mesmos princípios de arquitetura que uso em C#/.NET no dia a dia.",
    problem:
      "Construir uma API com padrões reais de produção: autenticação stateless, separação clara de responsabilidades, containerização e código testável por design. O resultado deveria ser referência pessoal para futuros projetos backend.",
    constraints:
      "API deve ser stateless (JWT sem sessão server-side), containerização completa sem dependências de sistema operacional, código estruturado para testabilidade. Documentação Swagger/OpenAPI obrigatória.",
    solution:
      "Arquitetura em camadas (Controller → Service → Repository), Spring Security com JWT para autenticação stateless, Hibernate para ORM, Docker multi-stage build para imagem de produção e Swagger para documentação interativa.",
    engineeringDecisions: [
      "Arquitetura em camadas — separação clara de responsabilidades e testabilidade por design",
      "JWT stateless — sem store de sessão, escala horizontalmente sem coordenação",
      "Spring Security — autenticação battle-tested em vez de implementação manual",
      "Docker multi-stage build — imagem de produção leve (~80MB) sem ferramentas de build",
      "Swagger/OpenAPI — documentação interativa gerada automaticamente a partir das annotations",
    ],
    challenges: [
      "Configurar Spring Security para proteger endpoints autenticados sem bloquear rotas públicas — resolvi com SecurityFilterChain customizado",
      "Gerenciar expiração e renovação de tokens JWT de forma segura e previsível — implementei refresh token rotation",
    ],
    outcome:
      "API funcional com documentação Swagger completa. Consolidou conhecimento em arquitetura de sistemas Java — lógica de camadas, DI e segurança diretamente aplicável ao trabalho diário com sistemas governamentais em C#/.NET no PRODEST.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
