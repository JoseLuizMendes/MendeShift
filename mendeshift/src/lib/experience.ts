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
    label: "SIARHES",
    title: "Roadmap estratégico adotado por outros estados",
    detail:
      "Liderou o mapeamento completo dos sistemas integrados ao SIARHES — Sistema de RH do Governo do ES. Conduziu entrevistas com responsáveis pelo desenvolvimento, consolidou dados e elaborou o roadmap para migração ao Novo SIARHES. O projeto foi levado para estudo e implementação em Santa Catarina.",
  },
  {
    label: "Qualidade",
    title: "SonarQube Grade A em 3 sistemas críticos",
    detail:
      "Assumiu a responsabilidade pelo Portal do Servidor, Sistema de Seleção e Sistema CHE. Implementou melhorias que elevaram todas as métricas de qualidade para Nota A em cada categoria avaliada pelo SonarQube.",
  },
  {
    label: "Desenvolvimento",
    title: "Sistemas em C# (.NET / ASP.NET)",
    detail:
      "Desenvolvimento e manutenção de sistemas governamentais em C# com .NET e ASP.NET — correção de bugs, novas funcionalidades e criação de APIs para integração entre sistemas.",
  },
  {
    label: "DevOps",
    title: "Azure DevOps & Git",
    detail:
      "Gestão de versionamento e ciclo de vida de aplicações com Azure DevOps e Git. Uso de repositórios, pipelines e boas práticas de integração contínua.",
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