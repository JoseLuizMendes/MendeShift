export type TechStackEntry = {
  category: string;
  items: string[];
};

export type ExperienceAchievement = {
  label: string;
  title: string;
  detail: string;
};

export type ExperienceRole = {
  title: string;
  organization: string;
  period: string;
  summary: string;
};

export type EducationEntry = {
  label: string;
  title: string;
  institution: string;
  period: string;
  detail?: string;
};

export type ExperienceData = {
  currentRole: ExperienceRole;
  previousRoles: ExperienceRole[];
  experienceAchievements: ExperienceAchievement[];
  techStack: TechStackEntry[];
  educationEntries: EducationEntry[];
};

const enData: ExperienceData = {
  currentRole: {
    title: "Back-end & Integrations Developer",
    organization: "TOTVS — Brazil's Largest Technology Company",
    period: "Jun/2026 — Present",
    summary:
      "Back-end development in ADVPL on the Protheus ERP and system-to-system integrations with n8n and REST APIs. Responsible for the end-to-end integration between a retail client's sales platform, Protheus and the Asaas payment gateway — billing, customers, payments, webhooks and notifications. Database and log analysis, technical documentation and continuous system improvement.",
  },

  previousRoles: [
    {
      title: "IT Analyst",
      organization: "PRODEST — Institute of Information and Communication Technology of Espírito Santo",
      period: "Oct/2024 — Jun/2026",
      summary:
        "First and second-level technical support, system development and maintenance, unit testing, UML process modeling, and database administration with SQL Developer. Involved in strategic projects for the State Government.",
    },
  ],

  experienceAchievements: [
    {
      label: "SIARHES — Highlight",
      title: "Strategic roadmap adopted by other Brazilian states",
      detail:
        "Led the complete mapping of systems integrated with SIARHES — the Human Resources Administration System of the ES State Government, which manages payroll and HR for the entire state civil service. Conducted interviews with development teams, consolidated critical integration data, and produced the full roadmap for migration to the new SIARHES. The project was recognized as a reference and taken for study and implementation in Santa Catarina.",
    },
    {
      label: "Integrations — TOTVS",
      title: "Protheus ERP × payment gateway (Asaas)",
      detail:
        "Responsible for the end-to-end integration between a retail client's sales platform, the Protheus ERP and the Asaas payment gateway: billing, customers, payments, webhooks and notifications — flow design, ADVPL development and n8n automations.",
    },
    {
      label: "Quality",
      title: "SonarQube Grade A across 3 critical systems",
      detail:
        "Took ownership of the Servidor Portal, Selection System and CHE System. Implemented systematic quality improvements that raised all metrics to Grade A in every category assessed by SonarQube — including bugs, vulnerabilities, code smells and coverage.",
    },
    {
      label: "Development",
      title: "Systems in C# (.NET / ASP.NET)",
      detail:
        "Development and maintenance of government systems in C# with .NET and ASP.NET — bug fixes, new features and API creation for integration between internal State Government systems.",
    },
    {
      label: "DevOps",
      title: "Azure DevOps & Git",
      detail:
        "Version control and application lifecycle management with Azure DevOps and Git. Use of repositories, CI/CD pipelines and continuous integration best practices across multi-team projects.",
    },
  ],

  educationEntries: [
    {
      label: "Degree",
      title: "Computer Science",
      institution: "FAESA",
      period: "2024 — Present",
    },
    {
      label: "Certification",
      title: "International AI Pre-Master's",
      institution: "Faculdade HUB · AGTU",
      period: "Nov/2025",
      detail:
        "Strategic application of AI/ML: process automation, prompt engineering, no-code solutions and AI media generation — the foundation of the chatbots and automations the studio ships.",
    },
    {
      label: "Certification",
      title: "The Impact of AI on Business — Academic PMIES",
      institution: "PMI Espírito Santo · FAESA",
      period: "Jun/2024",
      detail:
        "Project management and the strategic application of AI in business, with the Project Management Institute — ES chapter.",
    },
    {
      label: "High School",
      title: "1st place — ES · 17th place — Brazil",
      institution: "Colégio Sagrado Coração de Maria",
      period: "2019 — 2021",
      detail:
        "That discipline defines how I execute projects to this day — no shortcuts, no invisible technical debt.",
    },
  ],

  techStack: [
    {
      category: "Backend",
      items: ["C#", ".NET / ASP.NET", "Java", "Spring Boot", "Node.js"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Database",
      items: ["PostgreSQL", "SQL Server", "SQL Developer"],
    },
    {
      category: "Integrations & Automation",
      items: ["n8n", "REST APIs", "ADVPL / Protheus", "Webhooks"],
    },
    {
      category: "DevOps & Infrastructure",
      items: ["Azure DevOps", "Git", "Docker", "CI/CD Pipelines"],
    },
    {
      category: "Quality & Processes",
      items: ["SonarQube", "Playwright", "UML", "Unit Testing"],
    },
  ],
};

const ptData: ExperienceData = {
  currentRole: {
    title: "Desenvolvedor Back-end & Integrações",
    organization: "TOTVS — Maior Empresa de Tecnologia do Brasil",
    period: "Jun/2026 — Presente",
    summary:
      "Desenvolvimento back-end em ADVPL no ERP Protheus e integrações entre sistemas com n8n e APIs REST. Responsável pela integração de ponta a ponta entre a plataforma de vendas de um cliente do varejo, o Protheus e o gateway de pagamento Asaas — cobranças, clientes, pagamentos, webhooks e notificações. Análise de banco de dados e logs, documentação técnica e melhoria contínua dos sistemas.",
  },

  previousRoles: [
    {
      title: "Analista de TI",
      organization: "PRODEST — Instituto de Tecnologia da Informação e Comunicação do Espírito Santo",
      period: "Out/2024 — Jun/2026",
      summary:
        "Suporte técnico de primeiro e segundo nível, desenvolvimento e manutenção de sistemas, testes unitários, modelagem de processos em UML e administração de banco de dados com SQL Developer. Envolvido em projetos estratégicos para o Governo do Estado.",
    },
  ],

  experienceAchievements: [
    {
      label: "SIARHES — Destaque",
      title: "Roadmap estratégico adotado por outros estados brasileiros",
      detail:
        "Liderança no mapeamento completo dos sistemas integrados ao SIARHES — o Sistema de Administração de Recursos Humanos do Governo do ES, que gerencia folha de pagamento e RH de todo o funcionalismo estadual. Conduzi entrevistas com equipes de desenvolvimento, consolidei dados críticos de integração e produzi o roadmap completo para migração para o novo SIARHES. O projeto foi reconhecido como referência e levado para estudo e implementação em Santa Catarina.",
    },
    {
      label: "Integrações — TOTVS",
      title: "ERP Protheus × gateway de pagamento (Asaas)",
      detail:
        "Responsável pela integração de ponta a ponta entre a plataforma de vendas de um cliente do varejo, o ERP Protheus e o gateway Asaas: cobranças, clientes, pagamentos, webhooks e notificações — desenho do fluxo, desenvolvimento em ADVPL e automações com n8n.",
    },
    {
      label: "Qualidade",
      title: "SonarQube Grau A em 3 sistemas críticos",
      detail:
        "Assumi a propriedade do Portal do Servidor, Sistema de Seleção e Sistema CHE. Implementei melhorias sistemáticas de qualidade que elevaram todas as métricas ao Grau A em todas as categorias avaliadas pelo SonarQube — incluindo bugs, vulnerabilidades, code smells e cobertura.",
    },
    {
      label: "Desenvolvimento",
      title: "Sistemas em C# (.NET / ASP.NET)",
      detail:
        "Desenvolvimento e manutenção de sistemas governamentais em C# com .NET e ASP.NET — correção de bugs, novas funcionalidades e criação de APIs para integração entre sistemas internos do Governo do Estado.",
    },
    {
      label: "DevOps",
      title: "Azure DevOps & Git",
      detail:
        "Controle de versão e gerenciamento do ciclo de vida de aplicações com Azure DevOps e Git. Uso de repositórios, pipelines de CI/CD e boas práticas de integração contínua em projetos multitimes.",
    },
  ],

  educationEntries: [
    {
      label: "Graduação",
      title: "Ciência da Computação",
      institution: "FAESA",
      period: "2024 — Presente",
    },
    {
      label: "Certificação",
      title: "Pré-Mestrado Internacional em Inteligência Artificial",
      institution: "Faculdade HUB · AGTU",
      period: "Nov/2025",
      detail:
        "Aplicação estratégica de IA/ML: automação de processos, engenharia de prompts, soluções no-code e geração de mídia com IA — a base dos chatbots e automações que o estúdio entrega.",
    },
    {
      label: "Certificação",
      title: "O Impacto da IA no Negócio — Academic PMIES",
      institution: "PMI Espírito Santo · FAESA",
      period: "Jun/2024",
      detail:
        "Gestão de projetos e aplicação estratégica de IA nos negócios, com o capítulo Espírito Santo do Project Management Institute.",
    },
    {
      label: "Ensino Médio",
      title: "1° lugar — ES · 17° lugar — Brasil",
      institution: "Colégio Sagrado Coração de Maria",
      period: "2019 — 2021",
      detail:
        "Essa disciplina define como executo projetos até hoje — sem atalhos, sem dívida técnica invisível.",
    },
  ],

  techStack: [
    {
      category: "Backend",
      items: ["C#", ".NET / ASP.NET", "Java", "Spring Boot", "Node.js"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Banco de Dados",
      items: ["PostgreSQL", "SQL Server", "SQL Developer"],
    },
    {
      category: "Integrações & Automação",
      items: ["n8n", "APIs REST", "ADVPL / Protheus", "Webhooks"],
    },
    {
      category: "DevOps & Infraestrutura",
      items: ["Azure DevOps", "Git", "Docker", "Pipelines CI/CD"],
    },
    {
      category: "Qualidade & Processos",
      items: ["SonarQube", "Playwright", "UML", "Testes Unitários"],
    },
  ],
};

/** Returns experience data for the given locale. */
export function getExperienceByLocale(locale: string): ExperienceData {
  return locale === "pt" ? ptData : enData;
}

// Legacy named exports for backwards compatibility (English only)
export const currentRole = enData.currentRole;
export const experienceAchievements = enData.experienceAchievements;
export const educationEntries = enData.educationEntries;
export const techStack = enData.techStack;
