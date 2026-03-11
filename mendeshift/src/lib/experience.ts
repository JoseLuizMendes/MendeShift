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
};

export const currentRole: ExperienceRole = {
  title: "Analista de TI",
  organization: "PRODEST — Instituto de Tecnologia da Informação e Comunicação do Estado do ES",
  period: "Out/2024 — Presente",
  summary:
    "Atendimento técnico de primeiro e segundo nível, desenvolvimento e manutenção de sistemas, testes unitários, modelagem de processos com UML e administração de banco de dados com SQL Developer. Participação em projetos estratégicos do Governo do Estado.",
};

export const experienceAchievements: ExperienceAchievement[] = [
  {
    label: "SIARHES — Destaque",
    title: "Roadmap estratégico adotado por outros estados brasileiros",
    detail:
      "Liderou o mapeamento completo dos sistemas integrados ao SIARHES — Sistema de Administração de Recursos Humanos do Governo do ES, que gerencia a folha de pagamento e o RH de todo o funcionalismo público estadual. Conduziu entrevistas com as equipes responsáveis pelo desenvolvimento, consolidou dados críticos de integração e elaborou o roadmap completo para migração ao Novo SIARHES. O projeto foi reconhecido como referência e levado para estudo e implementação em Santa Catarina.",
  },
  {
    label: "Qualidade",
    title: "SonarQube Grade A em 3 sistemas críticos",
    detail:
      "Assumiu a responsabilidade pelo Portal do Servidor, Sistema de Seleção e Sistema CHE. Implementou melhorias sistemáticas de qualidade que elevaram todas as métricas para Nota A em cada categoria avaliada pelo SonarQube — incluindo bugs, vulnerabilidades, code smells e cobertura.",
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
      "Gestão de versionamento e ciclo de vida de aplicações com Azure DevOps e Git. Uso de repositórios, pipelines CI/CD e boas práticas de integração contínua em projetos com múltiplas equipes.",
  },
];

export const educationEntries: EducationEntry[] = [
  {
    label: "Formação",
    title: "Ciência da Computação",
    institution: "FAESA",
    period: "2024 — Presente",
  },
];

export const techStack: TechStackEntry[] = [
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
    category: "DevOps & Infra",
    items: ["Azure DevOps", "Git", "Docker", "CI/CD Pipelines"],
  },
  {
    category: "Qualidade & Processos",
    items: ["SonarQube", "Playwright", "UML", "Testes Unitários"],
  },
];