import { getBlogPosts } from "@/lib/blog";
import { loadMessages } from "@/i18n/server";
import { localizedUrl } from "@/lib/metadata";
import { getProjectsByLocale } from "@/lib/projects";

/**
 * /llms.txt — resumo do site em Markdown para assistentes de IA
 * (convenção llmstxt.org). Gerado no build a partir das mesmas fontes das
 * páginas (messages, projects.ts, posts MDX), então não desatualiza.
 *
 * Fica no topo de app/ pelo mesmo motivo de sitemap.ts e dos feeds: o
 * middleware do next-intl ignora paths com ponto.
 */
export const dynamic = "force-static";

type ServiceItem = { title: string; desc: string; timeline: string; slug: string };
type FaqItem = { q: string; a: string };

export async function GET() {
  const messages = await loadMessages("pt");
  const meta = messages.meta as { home_desc: string };
  const services = (messages.services_page as { items: ServiceItem[] }).items;
  const faq = (messages.faq as { items: FaqItem[] }).items;
  const pt = localizedUrl("pt");
  const en = localizedUrl("en");

  const lines = [
    "# MendeShift",
    "",
    `> ${meta.home_desc}`,
    "",
    "O MendeShift é o estúdio digital de José Luiz Mendes, engenheiro de software em Vitória, ES, Brasil. Ele desenha e constrói sites, landing pages, sistemas web, lojas virtuais e identidade visual, com atendimento remoto para todo o Brasil e em inglês para o exterior. O cliente fala direto com quem executa o projeto.",
    "",
    "## Serviços",
    "",
    ...services.map(
      (item) => `- [${item.title}](${pt}/servicos#${item.slug}): ${item.desc} Prazo típico: ${item.timeline}.`,
    ),
    "",
    "## Cases",
    "",
    ...getProjectsByLocale("pt").map(
      (project) =>
        `- [${project.title}](${pt}/projetos/${project.slug}): ${project.shortDesc} Stack: ${project.tech.join(", ")}.`,
    ),
    "",
    "## Blog",
    "",
    ...getBlogPosts("pt").map(
      (post) => `- [${post.title}](${pt}/blog/${post.slug}): ${post.description}`,
    ),
    "",
    "## Perguntas frequentes",
    "",
    ...faq.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
    "## Contato",
    "",
    `- [Briefing e proposta](${pt}/contato): formulário de briefing, com proposta em até 24h úteis.`,
    "- [WhatsApp](https://wa.me/5527996300333): +55 27 99630-0333",
    `- [Trajetória do fundador](${pt}/experience)`,
    "- [LinkedIn](https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/)",
    "- [GitHub](https://github.com/JoseLuizMendes)",
    "",
    "## English",
    "",
    `- [Home](${en}): the same content in English.`,
    `- [Services](${en}/servicos)`,
    `- [Cases](${en}/projetos)`,
    `- [Blog](${en}/blog)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
