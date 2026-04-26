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
  previewImage?: string;
  previewImageFocus?: string;
  previewImageFocusArchive?: string;
  context: string;
  problem: string;
  constraints: string;
  solution: string;
  engineeringDecisions: string[];
  challenges: string[];
  outcome: string;
  /** Portuguese overrides for all translatable string fields */
  pt?: Partial<
    Pick<
      Project,
      | "shortDesc"
      | "context"
      | "problem"
      | "constraints"
      | "solution"
      | "engineeringDecisions"
      | "challenges"
      | "outcome"
    >
  >;
};

export const projects: Project[] = [
  {
    slug: "wedding-platform",
    category: "Full Stack",
    title: "Wedding Platform",
    shortDesc: "RSVP • Payments via Mercado Pago • Collaborative gallery • E2E tests in CI",
    tech: ["Next.js 16", "Prisma", "Neon", "Mercado Pago", "Playwright"],
    metric: "Shipped to production — 07/09",
    gridSpan: "md:col-span-2 md:row-span-2",
    placeholderLabel: "EVENT STACK",
    placeholderCaption: "Critical flows, payments and collaborative gallery.",
    accentGradient: "bg-linear-to-br from-accent/10 to-transparent",
    previewImage: "/projects/wedding-platform.webp",
    previewImageFocus: "center 10%",
    previewImageFocusArchive: "center 95%",
    context:
      "I needed to manage a wedding with ~200 guests: RSVPs, payments, and a collaborative photo gallery open to all attendees. No off-the-shelf tool combined full customization with native integration to a Brazilian payment gateway. The project started as a personal need and became the most intensive engineering lab I've had.",
    problem:
      "Build a reliable platform from scratch for an event with a fixed date and zero tolerance for failure. Any production bug would affect real guests on the day — no rollback possible.",
    constraints:
      "Fixed deadline (07/09), zero budget for expensive infrastructure. Guests without accounts needed to confirm attendance and upload photos. The platform had to work well across a wide range of devices, from older smartphones to desktops.",
    solution:
      "Next.js 16 App Router with React 19 and Server Components, Prisma 7 + Neon (serverless PostgreSQL) with Prisma Adapter, NextAuth for authentication, Mercado Pago SDK for card and PIX payments, Vercel Blob for photo storage, Nodemailer for confirmation emails, TanStack Query on the client, and Playwright covering critical RSVP and checkout flows in CI.",
    engineeringDecisions: [
      "Neon (serverless PostgreSQL) + Prisma 7 — no meaningful cold start, versioned migrations and type-safety across all queries",
      "Vercel Blob for the gallery — direct client-to-managed-storage upload, no Node server in the critical path",
      "Mercado Pago over Stripe — full PIX, boleto and local wallet coverage without extra friction",
      "NextAuth with database session strategy — sessions persisted in Neon, no stateful JWT on the client",
      "Playwright for E2E in CI — RSVP and checkout flows tested automatically on every push before the event",
    ],
    challenges: [
      "Mercado Pago webhook idempotency — deduplication by event ID in the database to prevent duplicate charges on retry",
      "Collaborative upload without accounts — temporary access token sent by email, no open routes exposed",
      "Early deploy with confidence — production environment running with real data a week before, rollback documented and tested",
    ],
    outcome:
      "The platform ran without incidents throughout the entire event. RSVPs, payments and the gallery operated at 100% uptime. The most complete project in the portfolio — a real product, shipped on a fixed deadline, used by real people.",
    pt: {
      shortDesc: "RSVP • Pagamentos via Mercado Pago • Galeria colaborativa • Testes E2E em CI",
      context:
        "Precisei gerenciar um casamento com ~200 convidados: confirmações de presença, pagamentos e uma galeria colaborativa aberta para todos os participantes. Nenhuma ferramenta pronta combinava personalização total com integração nativa a um gateway de pagamento brasileiro. O projeto começou como necessidade pessoal e se tornou o laboratório de engenharia mais intenso que já tive.",
      problem:
        "Construir uma plataforma confiável do zero para um evento com data fixa e zero tolerância a falhas. Qualquer bug em produção afetaria convidados reais no dia — sem rollback possível.",
      constraints:
        "Prazo fixo (07/09), zero budget para infraestrutura cara. Convidados sem cadastro precisavam confirmar presença e enviar fotos. A plataforma tinha que funcionar bem em uma ampla faixa de dispositivos, de smartphones antigos a desktops.",
      solution:
        "Next.js 16 App Router com React 19 e Server Components, Prisma 7 + Neon (PostgreSQL serverless) com Prisma Adapter, NextAuth para autenticação, SDK do Mercado Pago para pagamentos via cartão e PIX, Vercel Blob para armazenamento de fotos, Nodemailer para e-mails de confirmação, TanStack Query no cliente e Playwright cobrindo os fluxos críticos de RSVP e checkout em CI.",
      engineeringDecisions: [
        "Neon (PostgreSQL serverless) + Prisma 7 — sem cold start significativo, migrações versionadas e type-safety em todas as queries",
        "Vercel Blob para a galeria — upload direto do cliente para o storage gerenciado, sem servidor Node no caminho crítico",
        "Mercado Pago no lugar do Stripe — cobertura total de PIX, boleto e carteiras locais sem fricção adicional",
        "NextAuth com estratégia de sessão em banco — sessões persistidas no Neon, sem JWT stateful no cliente",
        "Playwright para E2E em CI — fluxos de RSVP e checkout testados automaticamente a cada push antes do evento",
      ],
      challenges: [
        "Idempotência de webhook do Mercado Pago — deduplicação por event ID no banco para evitar cobranças duplicadas em retry",
        "Upload colaborativo sem cadastro — token de acesso temporário enviado por e-mail, sem rotas abertas expostas",
        "Deploy antecipado com confiança — ambiente de produção rodando com dados reais uma semana antes, rollback documentado e testado",
      ],
      outcome:
        "A plataforma rodou sem incidentes durante todo o evento. RSVPs, pagamentos e galeria operaram com 100% de uptime. O projeto mais completo do portfólio — um produto real, entregue em prazo fixo, usado por pessoas reais.",
    },
  },
  {
    slug: "barber-saas",
    category: "Product",
    title: "Barber Pro",
    shortDesc: "Barbershop scheduling • Multi-role • NextAuth • AgendamentoAPI",
    tech: ["Next.js 14", "Prisma", "PostgreSQL", "NextAuth", "Shadcn UI"],
    metric: "In development",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "BOOKING SYSTEM",
    placeholderCaption: "Scheduling, roles and barbershop hierarchy.",
    accentGradient: "bg-linear-to-tl from-foreground/8 to-transparent",
    previewImage: "/projects/barber-saas.webp",
    previewImageFocus: "10% 7%",
    previewImageFocusArchive: "10% 70%",
    context:
      "Local barbershops manage bookings through WhatsApp and notebooks, losing control over schedules and client history. The goal was to build a lightweight system with a real user hierarchy — owner, employees and clients — integrated with a dedicated scheduling API.",
    problem:
      "Correctly model the relationships between Barbershop, Barber, Employee and Booking without leaking data across distinct shops, while keeping the interface simple enough for non-technical owners to operate on mobile.",
    constraints:
      "Next.js frontend consuming an external Fastify API (AgendamentoAPI), NextAuth authentication without mandatory OAuth, mobile-first interface for barbers and clients, Prisma as the sole database access layer.",
    solution:
      "Next.js 14 with App Router, Prisma 6 + PostgreSQL for the local data model, NextAuth v4 with Prisma Adapter, Shadcn UI for scheduling components and forms, date-fns + react-day-picker for time slot selection, node-cron for expired booking cleanup, and AgendamentoAPI consumption via NEXT_PUBLIC_API_URL.",
    engineeringDecisions: [
      "Explicit roles in schema (USER / EMPLOYEE / BARBER) — each role has a dedicated profile (Barber, Employee) with business-specific fields",
      "Barber owns exactly one Barbershop — isolated by @unique on barbershopId, simplifies queries without manual tenantId",
      "NextAuth with Prisma Adapter — sessions in the database, no stateful JWT, compatible with the schema's role model",
      "node-cron for expired bookings — internal job that clears unconfirmed SCHEDULED bookings, no external service needed",
    ],
    challenges: [
      "Modeling the Barbershop → Barber → Employee → Booking hierarchy without data duplication or excessive joins",
      "Integrating NextAuth with custom roles without breaking the session flow — overriding session/jwt callbacks to expose role and profile",
      "Separating responsibilities between the frontend (Next.js) and backend (AgendamentoAPI) without duplicating validations",
    ],
    outcome:
      "Project paused with a complete data model and working authentication flow. The decoupled architecture (frontend + dedicated API) demonstrates the ability to think in distributed systems, not just Next.js monoliths.",
    pt: {
      shortDesc: "Agendamento para barbearia • Multi-papel • NextAuth • AgendamentoAPI",
      context:
        "Barbearias locais gerenciam agendamentos pelo WhatsApp e cadernos, perdendo controle sobre horários e histórico de clientes. O objetivo era construir um sistema leve com uma hierarquia de usuários real — dono, funcionários e clientes — integrado a uma API de agendamento dedicada.",
      problem:
        "Modelar corretamente as relações entre Barbearia, Barbeiro, Funcionário e Agendamento sem vazar dados entre estabelecimentos distintos, mantendo a interface simples o suficiente para donos não técnicos usarem no celular.",
      constraints:
        "Frontend Next.js consumindo uma API Fastify externa (AgendamentoAPI), autenticação NextAuth sem OAuth obrigatório, interface mobile-first para barbeiros e clientes, Prisma como única camada de acesso ao banco.",
      solution:
        "Next.js 14 com App Router, Prisma 6 + PostgreSQL para o modelo de dados local, NextAuth v4 com Prisma Adapter, Shadcn UI para componentes de agendamento e formulários, date-fns + react-day-picker para seleção de horários, node-cron para limpeza de agendamentos expirados e consumo da AgendamentoAPI via NEXT_PUBLIC_API_URL.",
      engineeringDecisions: [
        "Papéis explícitos no schema (USER / EMPLOYEE / BARBER) — cada papel tem um perfil dedicado (Barber, Employee) com campos específicos do negócio",
        "Barbeiro possui exatamente uma Barbearia — isolado por @unique no barbershopId, simplifica queries sem tenantId manual",
        "NextAuth com Prisma Adapter — sessões no banco, sem JWT stateful, compatível com o modelo de papéis do schema",
        "node-cron para agendamentos expirados — job interno que limpa agendamentos SCHEDULED não confirmados, sem serviço externo",
      ],
      challenges: [
        "Modelar a hierarquia Barbearia → Barbeiro → Funcionário → Agendamento sem duplicação de dados ou joins excessivos",
        "Integrar NextAuth com papéis customizados sem quebrar o fluxo de sessão — sobrescrevendo callbacks de session/jwt para expor papel e perfil",
        "Separar responsabilidades entre frontend (Next.js) e backend (AgendamentoAPI) sem duplicar validações",
      ],
      outcome:
        "Projeto pausado com modelo de dados completo e fluxo de autenticação funcionando. A arquitetura desacoplada (frontend + API dedicada) demonstra a capacidade de pensar em sistemas distribuídos, não apenas monolitos Next.js.",
    },
  },
  {
    slug: "agendamento-api",
    category: "Backend",
    title: "Scheduling API",
    shortDesc: "Fastify 5 • JWT • Rate limiting • Auto Swagger via Zod • Vitest",
    tech: ["Fastify", "TypeScript", "Prisma", "Zod", "Vitest"],
    metric: "Documented · Deployed on Vercel",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "API CORE",
    placeholderCaption: "JWT, rate limiting, Swagger and integrated tests.",
    accentGradient: "bg-linear-to-b from-muted-foreground/12 to-transparent",
    previewImage: "/projects/agendamento-api.webp",
    previewImageFocus: "center",
    previewImageFocusArchive: "center",
    context:
      "Dedicated backend for the Barber Pro system — built separately from the frontend to have full control over architecture, security and data layer testability. Secondary goal: deepen knowledge of the Fastify ecosystem, a performant alternative to Express with native type-safety.",
    problem:
      "Build a scheduling API with secure authentication, abuse protection (rate limiting), always up-to-date documentation, and test coverage without configuration overhead.",
    constraints:
      "Stateless API (JWT without server-side sessions), OpenAPI documentation auto-generated from Zod schemas, integration tests against a real database (no mocks), Vercel deployment without a dedicated server.",
    solution:
      "Fastify 5 with TypeScript and ESM, @fastify/jwt for stateless authentication, @fastify/rate-limit for endpoint protection, @fastify/swagger + swagger-ui with documentation auto-generated via fastify-type-provider-zod, Prisma 7 + PostgreSQL with pg adapter, bcryptjs for password hashing, and Vitest for unit and integration tests against a real database.",
    engineeringDecisions: [
      "Fastify over Express — superior performance, type-safety via fastify-type-provider-zod and battle-tested official plugins",
      "fastify-type-provider-zod — Zod schema becomes both request validation AND OpenAPI documentation simultaneously, no duplication",
      "@fastify/rate-limit — endpoint protection without custom middleware, configurable per route",
      "Vitest for integration tests against a real database — avoids divergence between mocked behavior and actual PostgreSQL queries",
      "Vercel serverless deployment — no dedicated VPS, auto-scaling with acceptable cold start for current volume",
    ],
    challenges: [
      "Configuring Fastify with ESM + TypeScript for serverless deployment on Vercel — tsconfig and entry point adjustments for runtime compatibility",
      "Integration tests against a real database — dedicated script that provisions a test database, runs migrations, and tears down after each suite",
    ],
    outcome:
      "API documented, tested and deployed. Demonstrates mastery of modern Node.js backend architecture — beyond Next.js API Routes — with real production concerns: security, observability and testability.",
    pt: {
      shortDesc: "Fastify 5 • JWT • Rate limiting • Swagger automático via Zod • Vitest",
      context:
        "Backend dedicado para o sistema Barber Pro — construído separadamente do frontend para ter controle total sobre arquitetura, segurança e testabilidade da camada de dados. Objetivo secundário: aprofundar conhecimento no ecossistema Fastify, uma alternativa performática ao Express com type-safety nativa.",
      problem:
        "Construir uma API de agendamento com autenticação segura, proteção contra abuso (rate limiting), documentação sempre atualizada e cobertura de testes sem overhead de configuração.",
      constraints:
        "API stateless (JWT sem sessões server-side), documentação OpenAPI gerada automaticamente a partir dos schemas Zod, testes de integração contra banco real (sem mocks), deploy no Vercel sem servidor dedicado.",
      solution:
        "Fastify 5 com TypeScript e ESM, @fastify/jwt para autenticação stateless, @fastify/rate-limit para proteção de endpoints, @fastify/swagger + swagger-ui com documentação gerada automaticamente via fastify-type-provider-zod, Prisma 7 + PostgreSQL com pg adapter, bcryptjs para hash de senhas e Vitest para testes unitários e de integração contra banco real.",
      engineeringDecisions: [
        "Fastify no lugar do Express — performance superior, type-safety via fastify-type-provider-zod e plugins oficiais battle-tested",
        "fastify-type-provider-zod — o schema Zod se torna ao mesmo tempo validação de request E documentação OpenAPI, sem duplicação",
        "@fastify/rate-limit — proteção de endpoints sem middleware customizado, configurável por rota",
        "Vitest para testes de integração contra banco real — evita divergência entre comportamento mockado e queries PostgreSQL reais",
        "Deploy serverless no Vercel — sem VPS dedicado, auto-scaling com cold start aceitável para o volume atual",
      ],
      challenges: [
        "Configurar Fastify com ESM + TypeScript para deploy serverless no Vercel — ajustes em tsconfig e entry point para compatibilidade de runtime",
        "Testes de integração contra banco real — script dedicado que provisiona um banco de teste, executa migrações e faz teardown após cada suite",
      ],
      outcome:
        "API documentada, testada e em produção. Demonstra domínio de arquitetura backend Node.js moderna — além de API Routes do Next.js — com preocupações reais de produção: segurança, observabilidade e testabilidade.",
    },
  },
  {
    slug: "belessence",
    category: "E-commerce",
    title: "Belessence",
    shortDesc: "Premium fragrance e-commerce • MP Checkout • Inventory management • Coupons • Resend",
    tech: ["Next.js 16", "Prisma", "PostgreSQL", "Mercado Pago", "Zustand"],
    metric: "In development",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "BEAUTY E-COMMERCE STACK",
    placeholderCaption: "Checkout, inventory and orders from scratch.",
    accentGradient: "bg-linear-to-tr from-accent/8 to-transparent",
    previewImage: "/projects/belessence-hero.webp",
    previewImageFocus: "50% 30%",
    previewImageFocusArchive: "50% 30%",
    context:
      "Premium fragrance e-commerce built from scratch — no Shopify, no Firebase, no shortcuts. The motivation was full control over the data model: catalog, cart, checkout, inventory management, coupons, reviews and transactional notifications, all within a familiar stack and under end-to-end ownership.",
    problem:
      "Build every subsystem of a real e-commerce without relying on ready-made platforms: an order model with historical integrity, Mercado Pago checkout with webhook idempotency, stock decremented only after payment confirmation, and guest checkout without mandatory registration.",
    constraints:
      "Guest checkout with CPF directly on the order (no mandatory sign-up), immutable price and product snapshot on order items, payments exclusively via Mercado Pago (PIX and card), transactional notifications via Resend + React Email, catalog filters via URL (no unnecessary global state).",
    solution:
      "Next.js 16 App Router with React 19, Prisma 7 + PostgreSQL with pg adapter, Zustand for client-side cart state, React Hook Form + Zod for form validation, Mercado Pago SDK for checkout, Resend + React Email for transactional emails, Embla Carousel for the product gallery, nuqs for URL-based filters, and Playwright + Vitest for testing.",
    engineeringDecisions: [
      "Snapshot on OrderItems — name, price and image recorded at purchase time, ensuring immutable history even if the product is edited or discontinued",
      "Stock decremented in the MP webhook — inventory reduction only after real payment confirmation, not at checkout click",
      "Guest checkout with null userId — CPF and email directly on the Order to support delivery and invoicing without registration friction",
      "nuqs for catalog filters — URL as source of truth for category, collection and sorting, no extra global state",
      "Zustand for the cart — state persisted locally, no server round-trip until checkout",
    ],
    challenges: [
      "Mercado Pago webhook idempotency — deduplication by mpPaymentId to prevent double inventory reduction on retry",
      "Snapshot vs. FK on OrderItems — explicitly defining when to use the live relation (analytics) versus recording a snapshot (order historical integrity)",
    ],
    outcome:
      "E-commerce with a complete data model, functional Mercado Pago checkout, order tracking and email notifications. Actively in development — demonstrates the ability to build commerce platforms from scratch without relying on third-party solutions.",
    pt: {
      shortDesc: "E-commerce de fragrâncias premium • Checkout MP • Gestão de estoque • Cupons • Resend",
      context:
        "E-commerce de fragrâncias premium construído do zero — sem Shopify, sem Firebase, sem atalhos. A motivação era ter controle total sobre o modelo de dados: catálogo, carrinho, checkout, gestão de estoque, cupons, avaliações e notificações transacionais, tudo dentro de uma stack familiar e sob ownership end-to-end.",
      problem:
        "Construir cada subsistema de um e-commerce real sem depender de plataformas prontas: um modelo de pedidos com integridade histórica, checkout via Mercado Pago com idempotência de webhook, estoque decrementado somente após confirmação de pagamento e checkout como convidado sem cadastro obrigatório.",
      constraints:
        "Checkout como convidado com CPF diretamente no pedido (sem cadastro obrigatório), snapshot imutável de preço e produto nos itens do pedido, pagamentos exclusivamente via Mercado Pago (PIX e cartão), notificações transacionais via Resend + React Email, filtros do catálogo via URL (sem estado global desnecessário).",
      solution:
        "Next.js 16 App Router com React 19, Prisma 7 + PostgreSQL com pg adapter, Zustand para estado do carrinho no cliente, React Hook Form + Zod para validação de formulários, SDK do Mercado Pago para checkout, Resend + React Email para e-mails transacionais, Embla Carousel para a galeria de produtos, nuqs para filtros baseados em URL e Playwright + Vitest para testes.",
      engineeringDecisions: [
        "Snapshot nos OrderItems — nome, preço e imagem registrados no momento da compra, garantindo histórico imutável mesmo se o produto for editado ou descontinuado",
        "Estoque decrementado no webhook do MP — redução de inventário somente após confirmação real de pagamento, não no clique de checkout",
        "Checkout como convidado com userId null — CPF e email diretamente no Order para suportar entrega e faturamento sem fricção de cadastro",
        "nuqs para filtros do catálogo — URL como source of truth para categoria, coleção e ordenação, sem estado global extra",
        "Zustand para o carrinho — estado persistido localmente, sem round-trip ao servidor até o checkout",
      ],
      challenges: [
        "Idempotência de webhook do Mercado Pago — deduplicação por mpPaymentId para evitar redução dupla de estoque em retry",
        "Snapshot vs. FK nos OrderItems — definir explicitamente quando usar a relação viva (analytics) versus gravar snapshot (integridade histórica do pedido)",
      ],
      outcome:
        "E-commerce com modelo de dados completo, checkout funcional via Mercado Pago, rastreamento de pedidos e notificações por e-mail. Em desenvolvimento ativo — demonstra a capacidade de construir plataformas de comércio do zero sem depender de soluções de terceiros.",
    },
  },
];

/**
 * Returns all projects with translatable fields resolved for the given locale.
 */
export function getProjectsByLocale(locale: string): Omit<Project, "pt">[] {
  return projects.map((p) => {
    const { pt, ...rest } = p;
    if (locale === "pt" && pt) {
      return { ...rest, ...pt };
    }
    return rest;
  });
}

/**
 * Returns a single project with translatable fields resolved for the given locale.
 */
export function getProjectBySlug(
  slug: string,
  locale = "en",
): Omit<Project, "pt"> | undefined {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return undefined;
  const { pt, ...rest } = project;
  if (locale === "pt" && pt) {
    return { ...rest, ...pt };
  }
  return rest;
}
