import { describe, expect, it } from "vitest";

import {
  alternateSlugFromIndex,
  buildBlogIndex,
  collectTagsFromIndex,
  findPostInIndex,
  listPostsFromIndex,
  parsePostFile,
  staticParamsFromIndex,
  type RawPostFile,
} from "@/lib/blog";

/** Helper: monta o conteúdo cru de um .mdx (frontmatter YAML + corpo). */
function mdx(front: Record<string, unknown>, body = "Corpo do post."): string {
  const yaml = Object.entries(front)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  return `---\n${yaml}\n---\n\n${body}`;
}

function file(
  folderId: string,
  locale: "en" | "pt",
  front: Record<string, unknown>,
  body?: string,
): RawPostFile {
  return { folderId, locale, raw: mdx(front, body) };
}

const enPost = file("clean-arch", "en", {
  slug: "clean-architecture",
  title: "Clean Architecture",
  description: "Layers that isolate change.",
  date: "2026-01-10",
  tags: ["Arquitetura", "opinião"],
});
const ptPost = file("clean-arch", "pt", {
  slug: "arquitetura-limpa",
  title: "Arquitetura Limpa",
  description: "Camadas que isolam mudança.",
  date: "2026-01-10",
  tags: ["Arquitetura", "opinião"],
});

describe("parsePostFile", () => {
  it("faz parse de frontmatter válido e separa o corpo", () => {
    const post = parsePostFile(enPost);
    expect(post.frontmatter.slug).toBe("clean-architecture");
    expect(post.frontmatter.title).toBe("Clean Architecture");
    expect(post.frontmatter.tags).toEqual(["arquitetura", "opinião"]); // normalizado (lowercase/trim)
    expect(post.frontmatter.draft).toBe(false); // default
    expect(post.content.trim()).toBe("Corpo do post.");
    expect(post.folderId).toBe("clean-arch");
    expect(post.locale).toBe("en");
  });

  it("aplica defaults: tags = [] e draft = false quando ausentes", () => {
    const post = parsePostFile(
      file("x", "en", {
        slug: "x",
        title: "X",
        description: "d",
        date: "2026-02-01",
      }),
    );
    expect(post.frontmatter.tags).toEqual([]);
    expect(post.frontmatter.draft).toBe(false);
  });

  it("rejeita post malformado (sem título)", () => {
    expect(() =>
      parsePostFile(
        file("bad", "en", { slug: "bad", description: "d", date: "2026-01-01" }),
      ),
    ).toThrow(/bad/); // erro cita o folderId/locale
  });

  it("rejeita data em formato inválido", () => {
    expect(() =>
      parsePostFile(
        file("bad", "en", {
          slug: "bad",
          title: "T",
          description: "d",
          date: "10/01/2026",
        }),
      ),
    ).toThrow();
  });

  it("rejeita slug que não é kebab-case", () => {
    expect(() =>
      parsePostFile(
        file("bad", "en", {
          slug: "Nao Kebab",
          title: "T",
          description: "d",
          date: "2026-01-01",
        }),
      ),
    ).toThrow();
  });
});

describe("buildBlogIndex", () => {
  it("indexa múltiplos arquivos", () => {
    const index = buildBlogIndex([enPost, ptPost]);
    expect(index).toHaveLength(2);
  });

  it("rejeita slug duplicado no mesmo locale", () => {
    const dup = file("other", "en", {
      slug: "clean-architecture",
      title: "Outro",
      description: "d",
      date: "2026-03-01",
    });
    expect(() => buildBlogIndex([enPost, dup])).toThrow(/clean-architecture/);
  });

  it("permite o mesmo slug em locales diferentes", () => {
    const enX = file("f", "en", {
      slug: "same",
      title: "EN",
      description: "d",
      date: "2026-01-01",
    });
    const ptX = file("f", "pt", {
      slug: "same",
      title: "PT",
      description: "d",
      date: "2026-01-01",
    });
    expect(() => buildBlogIndex([enX, ptX])).not.toThrow();
  });
});

describe("listPostsFromIndex", () => {
  const older = file("older", "en", {
    slug: "older",
    title: "Older",
    description: "d",
    date: "2025-12-01",
  });
  const draft = file("draft", "en", {
    slug: "draft-post",
    title: "Draft",
    description: "d",
    date: "2026-05-01",
    draft: true,
  });
  const index = buildBlogIndex([enPost, ptPost, older, draft]);

  it("lista só posts do locale pedido", () => {
    const en = listPostsFromIndex(index, "en");
    expect(en.every((p) => p.locale === "en")).toBe(true);
    // pt-only não vaza pro EN e vice-versa
    const pt = listPostsFromIndex(index, "pt");
    expect(pt.map((p) => p.slug)).toEqual(["arquitetura-limpa"]);
  });

  it("ordena por data desc", () => {
    const en = listPostsFromIndex(index, "en");
    expect(en.map((p) => p.slug)).toEqual(["clean-architecture", "older"]);
  });

  it("esconde drafts por padrão e os mostra com includeDrafts", () => {
    expect(listPostsFromIndex(index, "en").map((p) => p.slug)).not.toContain(
      "draft-post",
    );
    expect(
      listPostsFromIndex(index, "en", { includeDrafts: true }).map((p) => p.slug),
    ).toContain("draft-post");
  });

  it("não expõe o corpo (content) no resumo", () => {
    const [first] = listPostsFromIndex(index, "en");
    expect(first).not.toHaveProperty("content");
  });
});

describe("findPostInIndex — fallback de idioma", () => {
  // Post que existe SÓ em EN
  const enOnly = file("solo", "en", {
    slug: "en-only",
    title: "EN Only",
    description: "d",
    date: "2026-04-01",
  });
  const index = buildBlogIndex([enPost, ptPost, enOnly]);

  it("acha o post exato no locale pedido (sem fallback)", () => {
    const res = findPostInIndex(index, "arquitetura-limpa", "pt");
    expect(res?.isFallback).toBe(false);
    expect(res?.post.locale).toBe("pt");
  });

  it("faz fallback pro idioma disponível quando o locale pedido não tem o post", () => {
    const res = findPostInIndex(index, "en-only", "pt");
    expect(res).not.toBeNull();
    expect(res?.isFallback).toBe(true);
    expect(res?.post.locale).toBe("en");
  });

  it("retorna null quando o slug não existe em lugar nenhum", () => {
    expect(findPostInIndex(index, "inexistente", "en")).toBeNull();
  });
});

describe("alternateSlugFromIndex — mapa de slug pro language toggle", () => {
  const enOnly = file("solo", "en", {
    slug: "en-only",
    title: "EN Only",
    description: "d",
    date: "2026-04-01",
  });
  const index = buildBlogIndex([enPost, ptPost, enOnly]);

  it("resolve o par pt→en pelo folderId", () => {
    const alt = alternateSlugFromIndex(index, "arquitetura-limpa", "pt", "en");
    expect(alt).toEqual({ slug: "clean-architecture", isFallback: false });
  });

  it("resolve o par en→pt pelo folderId", () => {
    const alt = alternateSlugFromIndex(index, "clean-architecture", "en", "pt");
    expect(alt).toEqual({ slug: "arquitetura-limpa", isFallback: false });
  });

  it("sem tradução: mantém o slug atual e sinaliza fallback", () => {
    const alt = alternateSlugFromIndex(index, "en-only", "en", "pt");
    expect(alt).toEqual({ slug: "en-only", isFallback: true });
  });

  it("retorna null quando o post de origem não existe", () => {
    expect(alternateSlugFromIndex(index, "nao-existe", "en", "pt")).toBeNull();
  });
});

describe("staticParamsFromIndex", () => {
  const enOnly = file("solo", "en", {
    slug: "en-only",
    title: "EN Only",
    description: "d",
    date: "2026-04-01",
  });
  const draft = file("draft", "pt", {
    slug: "rascunho",
    title: "Rascunho",
    description: "d",
    date: "2026-05-01",
    draft: true,
  });
  const index = buildBlogIndex([enPost, ptPost, enOnly, draft]);

  it("gera params do locale + URLs de fallback (posts só do outro idioma)", () => {
    const pt = staticParamsFromIndex(index, "pt").map((p) => p.slug).sort();
    // arquitetura-limpa (pt nativo) + en-only (fallback, sob o slug EN)
    expect(pt).toEqual(["arquitetura-limpa", "en-only"]);
  });

  it("não gera params para drafts em produção", () => {
    const pt = staticParamsFromIndex(index, "pt").map((p) => p.slug);
    expect(pt).not.toContain("rascunho");
  });
});

describe("collectTagsFromIndex", () => {
  const p2 = file("p2", "en", {
    slug: "p2",
    title: "P2",
    description: "d",
    date: "2026-02-01",
    tags: ["arquitetura"],
  });
  const index = buildBlogIndex([enPost, p2]);

  it("agrega e conta tags do locale, ordenando por contagem desc", () => {
    const tags = collectTagsFromIndex(index, "en");
    expect(tags[0]).toEqual({ tag: "arquitetura", count: 2 });
    expect(tags.map((t) => t.tag)).toContain("opinião");
  });
});
