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
   * Caminho relativo a /public para o screenshot/foto do projeto.
   * Ex: "/projects/wedding-platform.webp"
   * Quando presente, substitui o gradiente no preview do card.
   * Quando ausente, usa accentGradient como fallback.
   */
  previewImage?: string;
  /**
   * Ponto focal da imagem (CSS object-position).
   * Controla qual parte da foto fica visível quando o container corta.
   * Ex: "center", "50% 70%", "top", "bottom", "30% 60%"
   * Padrão: "center"
   */
  previewImageFocus?: string;
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
      "Plataforma completa para gestão do casamento — RSVP, pagamentos via Mercado Pago, galeria colaborativa com Vercel Blob e testes E2E com Playwright.",
    tech: ["Next.js 16", "Prisma", "Neon", "Mercado Pago", "Playwright"],
    metric: "Entregue em produção — 07/09",
    gridSpan: "md:col-span-2 md:row-span-2",
    placeholderLabel: "EVENT STACK",
    placeholderCaption: "Fluxos críticos, pagamentos e galeria colaborativa.",
    accentGradient: "bg-linear-to-br from-accent/10 to-transparent",
    previewImage: "/projects/wedding-platform.webp",
    previewImageFocus: "center 70%",
    context:
      "Precisava gerenciar um casamento com ~200 convidados: confirmações de presença, pagamentos e uma galeria de fotos colaborativa aberta a todos os convidados. Nenhuma ferramenta de mercado combinava personalização completa com integração nativa a gateway de pagamento brasileiro. O projeto nasceu como necessidade pessoal e virou o laboratório mais intenso de engenharia que tive.",
    problem:
      "Construir do zero uma plataforma confiável para um evento com data fixa e zero tolerância a falhas. Qualquer bug em produção afetaria convidados reais no dia — sem possibilidade de rollback.",
    constraints:
      "Prazo fixo (07/09), zero orçamento para infraestrutura cara. Convidados sem conta precisavam confirmar presença e fazer upload de fotos. A plataforma deveria funcionar bem em dispositivos variados, de smartphones antigos a desktops.",
    solution:
      "Next.js 16 App Router com React 19 e Server Components, Prisma 7 + Neon (PostgreSQL serverless) com Prisma Adapter, NextAuth para autenticação, Mercado Pago SDK para cartão e PIX, Vercel Blob para armazenamento das fotos, Nodemailer para e-mails de confirmação, TanStack Query no cliente e Playwright cobrindo os fluxos críticos de RSVP e checkout em CI.",
    engineeringDecisions: [
      "Neon (PostgreSQL serverless) + Prisma 7 — banco sem cold start expressivo, migrations versionadas e type-safety em todas as queries",
      "Vercel Blob para galeria — upload direto do cliente para storage gerenciado, sem passar pelo servidor Node",
      "Mercado Pago em vez de Stripe — cobertura completa de PIX, boleto e carteiras nacionais sem friction extra",
      "NextAuth com session strategy database — sessões persistidas no Neon, sem JWT estatal no cliente",
      "Playwright para E2E em CI — fluxo de RSVP e checkout testado automaticamente a cada push antes do evento",
    ],
    challenges: [
      "Idempotência em webhooks do Mercado Pago — deduplicação por evento ID no banco para evitar cobranças duplicadas em caso de retry",
      "Upload colaborativo sem conta — token de acesso temporário enviado por e-mail, sem expor rotas abertas",
      "Deploy antecipado com confiança — ambiente de produção rodando com dados reais uma semana antes, rollback documentado e testado",
    ],
    outcome:
      "Plataforma funcionou sem incidentes durante todo o evento. Confirmações, pagamentos e galeria operaram com 100% de disponibilidade. O projeto mais completo do portfólio — produto real, entregue com prazo fixo, usado por pessoas reais.",
  },
  {
    slug: "barber-saas",
    category: "Product",
    title: "Barber Pro",
    shortDesc:
      "Sistema de agendamento para barbearias — modelo de dados multi-role (barbeiro, funcionário, cliente), autenticação com NextAuth e consumo da AgendamentoAPI.",
    tech: ["Next.js 14", "Prisma", "PostgreSQL", "NextAuth", "Shadcn UI"],
    metric: "Em desenvolvimento",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "BOOKING SYSTEM",
    placeholderCaption: "Agenda, roles e hierarquia de barbearia.",
    accentGradient: "bg-linear-to-tl from-foreground/8 to-transparent",
    previewImage: "/projects/barber-saas.webp",
    previewImageFocus: "10% 7%",
    context:
      "Barbearias locais gerenciam agendamentos via WhatsApp e cadernos, perdendo controle de horários e histórico de clientes. O objetivo era construir um sistema leve com hierarquia real de usuários — dono, funcionários e clientes — integrado a uma API de agendamentos dedicada.",
    problem:
      "Modelar corretamente as relações entre Barbershop, Barber, Employee e Booking sem vazar dados entre barbearias distintas, mantendo interface simples o suficiente para donos não-técnicos operarem no celular.",
    constraints:
      "Frontend Next.js consumindo API Fastify externa (AgendamentoAPI), autenticação via NextAuth sem OAuth obrigatório, interface mobile-first para barbeiros e clientes, Prisma como única camada de acesso ao banco.",
    solution:
      "Next.js 14 com App Router, Prisma 6 + PostgreSQL para o modelo de dados local, NextAuth v4 com Prisma Adapter, Shadcn UI para componentes de agenda e formulários, date-fns + react-day-picker para seleção de horários, node-cron para limpeza de reservas expiradas e consumo da AgendamentoAPI via NEXT_PUBLIC_API_URL.",
    engineeringDecisions: [
      "Schema com roles explícitas (USER / EMPLOYEE / BARBER) — cada role tem perfil dedicado (Barber, Employee) com campos específicos de negócio",
      "Barber tem exatamente um Barbershop — isolamento por @unique no barbershopId, simplifica queries sem tenantId manual",
      "NextAuth com Prisma Adapter — sessões no banco, sem JWT estatal, compatível com o modelo de roles no schema",
      "node-cron para reservas expiradas — job interno que limpa bookings SCHEDULED não confirmados, sem serviço externo",
    ],
    challenges: [
      "Modelar a hierarquia Barbershop → Barber → Employee → Booking sem duplicação de dados ou joins excessivos",
      "Integrar NextAuth com roles customizadas sem quebrar o fluxo de sessão — override de session/jwt callbacks para expor role e perfil",
      "Separar responsabilidades entre frontend (Next.js) e backend (AgendamentoAPI) sem duplicar validações",
    ],
    outcome:
      "Projeto pausado com modelo de dados completo e fluxo de autenticação funcionando. A arquitetura separada (frontend + API dedicada) demonstra capacidade de pensar em sistemas distribuídos, não apenas em monólitos Next.js.",
  },
  {
    slug: "agendamento-api",
    category: "Backend",
    title: "Agendamento API",
    shortDesc:
      "API REST com Fastify 5 e TypeScript — autenticação JWT, rate limiting, documentação Swagger automática, Prisma + PostgreSQL e testes com Vitest.",
    tech: ["Fastify", "TypeScript", "Prisma", "Zod", "Vitest"],
    metric: "Documentada · Deploy na Vercel",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "API CORE",
    placeholderCaption: "JWT, rate limit, Swagger e testes integrados.",
    accentGradient: "bg-linear-to-b from-muted-foreground/12 to-transparent",
    previewImage: "/projects/agendamento-api.webp",
    context:
      "Backend dedicado para o sistema Barber Pro — construído separado do frontend para ter controle total sobre arquitetura, segurança e testabilidade da camada de dados. Objetivo secundário: aprofundar conhecimento no ecossistema Fastify, alternativa performática ao Express com type-safety nativa.",
    problem:
      "Construir uma API de agendamentos com autenticação segura, proteção contra abuso (rate limiting), documentação sempre atualizada e cobertura de testes sem overhead de configuração.",
    constraints:
      "API stateless (JWT sem sessão server-side), documentação OpenAPI gerada automaticamente a partir do schema Zod, testes de integração com banco real (não mocks), deploy no Vercel sem servidor dedicado.",
    solution:
      "Fastify 5 com TypeScript e ESM, @fastify/jwt para autenticação stateless, @fastify/rate-limit para proteção de endpoints, @fastify/swagger + swagger-ui com documentação gerada automaticamente via fastify-type-provider-zod, Prisma 7 + PostgreSQL com pg adapter, bcryptjs para hash de senhas e Vitest para testes unitários e de integração com banco de dados real.",
    engineeringDecisions: [
      "Fastify em vez de Express — performance superior, type-safety via fastify-type-provider-zod e plugins oficiais battle-tested",
      "fastify-type-provider-zod — schema Zod vira validação de request E documentação OpenAPI simultaneamente, sem duplicação",
      "@fastify/rate-limit — proteção de endpoints sem middleware custom, configurável por rota",
      "Vitest para testes de integração com banco real — evita divergência entre comportamento mockado e queries reais no PostgreSQL",
      "Deploy no Vercel como serverless — sem VPS dedicado, escala automática com cold start aceitável para o volume atual",
    ],
    challenges: [
      "Configurar Fastify com ESM + TypeScript para deploy serverless no Vercel — ajuste no tsconfig e no entry point para compatibilidade com o runtime",
      "Testes de integração com banco real — script dedicado que provisiona banco de teste, roda migrations e faz teardown após cada suite",
    ],
    outcome:
      "API documentada, testada e deployed. Demonstra domínio de arquitetura backend Node.js moderna — além do Next.js API Routes — com preocupações reais de produção: segurança, observabilidade e testabilidade.",
  },
  {
    slug: "belessence",
    category: "E-commerce",
    title: "Belessence",
    shortDesc:
      "E-commerce de perfumes premium — catálogo, checkout com Mercado Pago, gestão de pedidos e estoque, cupons, avaliações e notificações transacionais via Resend.",
    tech: ["Next.js 16", "Prisma", "PostgreSQL", "Mercado Pago", "Zustand"],
    metric: "Em desenvolvimento",
    gridSpan: "md:col-span-2 md:row-span-1",
    placeholderLabel: "BAUTY E-COMMERCE STACK",
    placeholderCaption: "Checkout, estoque e pedidos do zero.",
    accentGradient: "bg-linear-to-tr from-accent/8 to-transparent",
    previewImage: "/projects/belessence-hero.webp",
    previewImageFocus:"50% 30%",
    context:
      "E-commerce de perfumes premium construído do zero — sem Shopify, sem Firebase, sem atalhos. A motivação era ter controle total sobre o modelo de dados: catálogo, carrinho, checkout, gestão de estoque, cupons, avaliações e notificações transacionais, tudo dentro de uma stack familiar e sob responsabilidade end-to-end.",
    problem:
      "Construir todos os subsistemas de um e-commerce real sem depender de plataformas prontas: modelo de pedidos com integridade histórica, checkout via Mercado Pago com idempotência no webhook, estoque decrementado apenas após confirmação de pagamento e guest checkout sem obrigatoriedade de conta.",
    constraints:
      "Guest checkout com CPF direto no pedido (sem cadastro obrigatório), snapshot imutável de preço e produto nos itens do pedido, pagamento exclusivamente via Mercado Pago (PIX e cartão), notificações transacionais via Resend + React Email, filtros de catálogo via URL (sem estado global desnecessário).",
    solution:
      "Next.js 16 App Router com React 19, Prisma 7 + PostgreSQL com adapter pg, Zustand para estado do carrinho no cliente, React Hook Form + Zod para validação de formulários, Mercado Pago SDK para checkout, Resend + React Email para e-mails transacionais, Embla Carousel para galeria de produtos, nuqs para filtros via URL e Playwright + Vitest para testes.",
    engineeringDecisions: [
      "Snapshot nos OrderItems — nome, preço e imagem gravados no momento da compra, garantindo histórico imutável mesmo se o produto for editado ou descontinuado",
      "Estoque decrementado no webhook do MP — baixa no stock só após confirmação real de pagamento, não no clique do checkout",
      "Guest checkout com userId null — CPF e e-mail direto no Order para suportar entrega e NF sem friction de cadastro",
      "nuqs para filtros de catálogo — URL como fonte de verdade para categoria, coleção e ordenação, sem estado global extra",
      "Zustand para carrinho — estado persistido localmente, sem round-trip ao servidor até o momento do checkout",
    ],
    challenges: [
      "Idempotência no webhook do Mercado Pago — deduplicação por mpPaymentId para evitar baixa dupla de estoque em caso de retry",
      "Snapshot vs. FK nos OrderItems — definir explicitamente quando usar a relação viva (analytics) versus gravar snapshot (integridade histórica do pedido)",
    ],
    outcome:
      "E-commerce com modelo de dados completo, checkout funcional via Mercado Pago, rastreamento de pedidos e notificações por e-mail. Projeto em desenvolvimento ativo — demonstra capacidade de construir plataformas de comércio do zero, sem depender de soluções de terceiros.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
