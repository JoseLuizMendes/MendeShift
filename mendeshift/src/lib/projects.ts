import type { Lead } from "@/lib/leads";

/** Mesmo union do lead — liga cada case a um dos 4 serviços vendidos. */
export type ServiceType = Lead["serviceType"];

/** Âncoras da página /servicos correspondentes a cada tipo de serviço. */
export const serviceAnchors: Record<ServiceType, string> = {
  site: "sites-e-landing-pages",
  sistema: "sistemas-web",
  ecommerce: "ecommerce",
  design: "design-e-branding",
};

export type Project = {
  slug: string;
  category: string;
  /** Serviço do estúdio que este case demonstra (badge/link no case). */
  serviceType: ServiceType;
  title: string;
  shortDesc: string;
  tech: string[];
  metric?: string;
  previewImage?: string;
  previewImageAlt?: string;
  gallery?: {
    src: string;
    width: number;
    height: number;
    caption: { en: string; pt: string };
  }[];
  walkthrough?: {
    title: string;
    description: string;
    imageAlt: string;
    articleSlug: string;
  };
  walkthroughImage?: string;
  publicUrl?: string;
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
      | "title"
      | "category"
      | "metric"
      | "shortDesc"
      | "previewImageAlt"
      | "walkthrough"
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
    slug: "belessence",
    category: "Commerce & booking",
    serviceType: "ecommerce",
    title: "Mari Beauty Studio",
    shortDesc: "Online salon booking and a shared admin for the salon and boutique.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Asaas"],
    previewImage: "/portfolio/mari-beauty-editorial.webp",
    publicUrl: "https://belessence.vercel.app/",
    previewImageAlt: "The Mari Beauty salon homepage on a graphite laptop set on pale stone",
    walkthrough: {
      title: "From service to appointment",
      description: "Clients choose a service and an available time, then review the date, location and price before confirming. The booking goes into the salon’s calendar, where staff can manage appointments.",
      imageAlt: "A tablet shows a haircut selected, a calendar of available times and the booking summary.",
      articleSlug: "how-i-prevented-overlapping-bookings",
    },
    walkthroughImage: "/portfolio/mari-beauty-booking-editorial.webp",
    context: "Belle Essence combines a boutique perfumery and a beauty salon. The business needed a storefront, online booking and a single place to manage both.",
    problem: "Let visitors shop and book online while giving the owner control over when each part of the business is available.",
    constraints: "Booking works without an account. The server verifies prices, stock and discounts, and prevents conflicting appointments.",
    solution: "Built a catalog and checkout, a public salon booking flow and an administration panel for products, orders, services and appointments.",
    engineeringDecisions: [
      "Feature switches control the store and salon in the navigation and at the route level.",
      "The same server rules compute available times and validate a booking. A database lock prevents concurrent reservations from claiming the same slot.",
      "Checkout recalculates price, inventory and discounts on the server.",
    ],
    challenges: ["Keep shopping and scheduling independent while sharing one admin panel."],
    outcome: "One platform supports the storefront and the salon. The owner can operate the two modules together or independently.",
    pt: {
      category: "Comércio e agenda",
      shortDesc: "Agendamento online e gestão do salão e da perfumaria no mesmo painel.",
      previewImageAlt: "Página inicial do salão Mari Beauty em um notebook grafite sobre pedra clara",
      walkthrough: {
        title: "Da escolha do serviço à reserva",
        description: "A cliente escolhe o serviço e um horário livre, depois confere data, local e preço antes de confirmar. A reserva entra na agenda do salão, onde a equipe gerencia os atendimentos.",
        imageAlt: "Tablet com o corte selecionado, o calendário de horários disponíveis e o resumo do agendamento.",
        articleSlug: "como-evitei-reservas-sobrepostas",
      },
      context: "A Belle Essence reúne uma perfumaria boutique e um salão de beleza. O negócio precisava de vitrine, agendamento online e um painel para gerenciar as duas operações.",
      problem: "Permitir compras e reservas online com controle sobre a disponibilidade de cada frente do negócio.",
      constraints: "O agendamento funciona sem conta. O servidor valida preços, estoque e descontos e evita reservas sobrepostas.",
      solution: "Desenvolvi o catálogo e o checkout, o agendamento público do salão e o painel para produtos, pedidos, serviços e horários.",
      engineeringDecisions: [
        "A loja e o salão podem ser ligados ou desligados tanto na navegação quanto nas rotas do servidor.",
        "As mesmas regras calculam a disponibilidade e validam a reserva. Um bloqueio no banco evita que duas reservas concorrentes ocupem o mesmo horário.",
        "O checkout recalcula preço, estoque e descontos no servidor.",
      ],
      challenges: ["Manter compra e agendamento independentes dentro de um único painel."],
      outcome: "A vitrine e o salão operam na mesma plataforma. A responsável pode usar os dois módulos juntos ou de forma independente.",
    },
  },
  {
    slug: "bipday",
    category: "Productivity PWA",
    serviceType: "sistema",
    title: "BipDay",
    metric: "Personal use · alerts under validation",
    shortDesc: "Installable routine planner with transition reminders, daily views and a focus timer.",
    tech: ["Next.js", "TypeScript", "Prisma", "Serwist", "Web Push"],
    previewImage: "/portfolio/bipday-landing-editorial.webp",
    publicUrl: "https://rotina-app-seven.vercel.app/",
    previewImageAlt: "BipDay landing page on a graphite laptop in a green studio",
    gallery: [{
      src: "/portfolio/bipday-alert-editorial.webp",
      width: 6536,
      height: 4357,
      caption: { en: "BipDay's introduction to transition alerts", pt: "Como o BipDay apresenta os alertas de transição" },
    }],
    context: "BipDay is a personal product for organizing a routine around time blocks. It focuses on the moment when someone needs to switch activities.",
    problem: "A task list tells you what is due. It does little to remind you that the next activity is about to start.",
    constraints: "The planner should feel useful on a phone and avoid punitive feedback when a streak breaks.",
    solution: "Built an installable web app with appointments, tasks, daily views, a focus timer and transition alerts delivered with Web Push.",
    engineeringDecisions: [
      "Transition reminders are tied to scheduled blocks rather than a static task list.",
      "Serwist builds the service worker separately for the installable app and push alerts.",
      "Streak feedback acknowledges progress without marking a missed day as a failure.",
    ],
    challenges: ["Validate notifications when the app is closed and make permission and subscription states understandable."],
    outcome: "The app is in personal use while delivery of transition alerts is validated on devices.",
    pt: {
      category: "PWA de produtividade",
      metric: "Uso próprio · alertas em validação",
      shortDesc: "Planejador de rotina instalável, com alertas de transição, visão do dia e timer de foco.",
      previewImageAlt: "Página inicial do BipDay em um notebook grafite num cenário verde",
      context: "O BipDay é um produto próprio para organizar a rotina em blocos de tempo. O foco é o momento em que a pessoa precisa mudar de atividade.",
      problem: "Uma lista registra o que precisa ser feito, mas pouco ajuda a perceber que o próximo bloco está prestes a começar.",
      constraints: "O planejamento precisa funcionar bem no celular, e perder uma sequência não deve gerar punição.",
      solution: "Desenvolvi um app instalável com compromissos, tarefas, visão diária, timer de foco e alertas de transição via Web Push.",
      engineeringDecisions: [
        "O alerta de transição acompanha o horário do bloco, em vez de depender de uma lista estática.",
        "O Serwist gera o service worker à parte para instalação e notificações.",
        "O indicador de sequência reconhece o progresso sem marcar o dia perdido como falha.",
      ],
      challenges: ["Validar notificações com o app fechado e deixar claros os estados de permissão e inscrição."],
      outcome: "O app está em uso próprio, com a entrega dos alertas ainda em validação nos dispositivos.",
    },
  },
  {
    slug: "wedding-platform",
    category: "Event platform",
    serviceType: "sistema",
    title: "Wedding Website",
    shortDesc: "RSVP • Payments via Mercado Pago • Collaborative gallery • E2E tests in CI",
    tech: ["Next.js 16", "Prisma", "Neon", "Mercado Pago", "Playwright"],
    metric: "Launched for the event · September 7, 2026",
    previewImage: "/portfolio/wedding-hero-editorial.webp",
    previewImageAlt: "Wedding homepage with a photo of the couple and the RSVP button on a phone",
    gallery: [
      {
        src: "/portfolio/wedding-timeline-editorial.webp",
        width: 6536,
        height: 4357,
        caption: { en: "The couple's story and its path on desktop", pt: "A trilha de Nossa História no desktop" },
      },
      {
        src: "/portfolio/wedding-attendance-editorial.webp",
        width: 6536,
        height: 4357,
        caption: { en: "Mobile guest list with sample entries", pt: "Lista de presença no celular com convidados fictícios" },
      },
    ],
    publicUrl: "https://wedding-new-ruddy.vercel.app/casamento",
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
      "The platform was delivered before the event and supported RSVPs, payments and photo uploads for guests.",
    pt: {
      title: "Site do meu casamento",
      category: "Plataforma para evento",
      previewImageAlt: "Página do casamento no celular com foto do casal e botão para confirmar presença",
      metric: "Publicado para o evento · 7 de setembro de 2026",
      shortDesc: "Confirmação de presença, pagamentos e galeria colaborativa para um casamento de cerca de 200 convidados.",
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
        "A plataforma foi entregue antes do evento e reuniu confirmação de presença, pagamentos e envio de fotos pelos convidados.",
    },
  },
  {
    slug: "dr-gabriel-cavalcante-web",
    category: "Website & management hub",
    serviceType: "sistema",
    title: "Dr. Gabriel Cavalcanti",
    shortDesc: "Public website and operations hub for a dental clinic with two locations.",
    tech: ["Next.js", "TypeScript", "Drizzle", "PostgreSQL", "FullCalendar"],
    previewImage: "/portfolio/gabriel-hero-editorial.webp",
    previewImageAlt: "Dr. Gabriel Cavalcanti's homepage on a laptop set on pale stone",
    gallery: [{
      src: "/portfolio/gabriel-units-editorial.webp",
      width: 6536,
      height: 4357,
      caption: { en: "Clinic locations and appointment contact links", pt: "Unidades da clínica e opções de contato para agendamento" },
    }],
    context: "A dental clinic with two locations needed a public site for patients and a hub for its staff.",
    problem: "Make treatment and location information easy to find while supporting the clinic's scheduling, patient history and content updates.",
    constraints: "Patients use the public site on mobile. Internal records and management tools require authenticated access.",
    solution: "Built a public site for treatments and locations, and a staff hub with scheduling, patient records, reports and a CMS.",
    engineeringDecisions: [
      "The website and the hub share a visual foundation while serving different tasks.",
      "The calendar validates schedule conflicts and supports appointments by location.",
      "The CMS reads content from the database and falls back to files for entries that are not yet populated.",
    ],
    challenges: ["Make the weekly calendar usable on desktop and keep the public site readable on mobile."],
    outcome: "The clinic's team can maintain site content and manage its schedule from the same system.",
    pt: {
      category: "Site e hub de gestão",
      shortDesc: "Site público e hub de gestão para uma clínica odontológica com duas unidades.",
      previewImageAlt: "Página inicial do Dr. Gabriel Cavalcanti em um notebook sobre pedra clara",
      context: "Uma clínica odontológica com duas unidades precisava de um site para os pacientes e um hub para a equipe.",
      problem: "Facilitar a busca por tratamentos e unidades e dar à clínica controle da agenda, do histórico de pacientes e do conteúdo público.",
      constraints: "O paciente costuma chegar pelo celular. Prontuários e ferramentas internas exigem autenticação.",
      solution: "Desenvolvi o site de tratamentos e unidades e um hub com agenda, prontuário, relatórios e CMS.",
      engineeringDecisions: [
        "O site e o hub compartilham uma base visual, com interfaces adaptadas a cada tarefa.",
        "A agenda valida conflitos de horário e organiza os atendimentos por unidade.",
        "O CMS lê o banco e usa conteúdo em arquivo quando uma entrada ainda não foi preenchida.",
      ],
      challenges: ["Fazer a agenda semanal funcionar bem no desktop e manter o site público legível no celular."],
      outcome: "A equipe pode editar o conteúdo do site e administrar a agenda no mesmo sistema.",
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
