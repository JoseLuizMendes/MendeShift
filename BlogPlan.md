# Plano — Blog nativo (MDX) do MendeShift · v1

## Context

O MendeShift é o site agência-portfólio do usuário (Next.js 16 App Router, React 19, Tailwind v4, bilíngue EN/PT via `next-intl`) — a vitrine onde ele vende imagem e serviços. Hoje o conteúdo é 100% *code-driven* (módulos TS tipados como `src/lib/projects.ts` + JSON de i18n) e **não existe camada editorial**. O README já lista "blog" como item de Fase 2.

O objetivo desta entrega é criar a **primeira versão de um blog nativo**, dentro do próprio site (não uma ferramenta externa), pra: (1) o usuário escrever sobre o que aprende/pensa enquanto termina a faculdade, (2) gerar autoridade pra empregabilidade, e (3) plantar a semente de uma futura newsletter/comunidade — **sem** construir essa parte agora (YAGNI).

Além da feature em si, o blog é usado deliberadamente como **vitrine de arquitetura e princípios** (SOLID, YAGNI, camadas testáveis, TDD) — valores que o usuário quer que o projeto demonstre na prática.

### Decisões travadas com o usuário
- **Escopo v1:** blog puro de conteúdo. Sem newsletter/comunidade ainda, mas arquitetado pra encaixar depois.
- **Autoria:** arquivos **MDX versionados no repo** (permite embutir componentes React em posts).
- **Idioma:** **bilíngue por post (EN+PT)**, com **rede de segurança**: um post pode existir em só um idioma sem travar a publicação (fallback elegante).
- **Features v1:** syntax highlighting (build-time), tags + filtro, **RSS/Atom feed**.
- **Integração:** link "Blog" no nav + seção "escritos recentes" na home.
- **Deferido (documentado, fora da v1):** polish de leitura (capa + tempo de leitura + relacionados), páginas de tag pra SEO, busca, newsletter ativa, comunidade/comentários.

## Arquitetura (camadas — SOLID)

Quatro responsabilidades separadas, cada uma trocável sem quebrar as outras:

1. **Conteúdo** — arquivos MDX em `mendeshift/content/blog/`. Puro dado.
2. **Data layer** — `src/lib/blog.ts`: funções **puras** (sem React) que leem os arquivos, validam frontmatter, listam/ordenam/filtram e resolvem fallback de idioma. Espelha o padrão de `src/lib/projects.ts` (ex.: `getProjectsByLocale`, `getProjectBySlug`).
3. **Render** — `src/_components/blog/*` + mapa de componentes MDX, usando o design system atual (tokens de `globals.css`, primitivos de `src/_components/ui/`, `Container`/`Section`).
4. **Rotas** — `src/app/[locale]/blog/*`: só orquestram (chamam data layer + render). Tudo **SSG**.

O data layer é o *seam* testável; trocar MDX→CMS um dia mexe só nele.

## Estrutura de conteúdo

```
mendeshift/content/blog/
  <slug>/
    en.mdx
    pt.mdx
```
- **Slug = nome da pasta**, compartilhado entre idiomas → o `language-toggle` atual mapeia `/blog/x` ↔ `/pt/blog/x` sem lógica extra.
- **Frontmatter validado com `zod`** (já é dependência): `title, description, date, tags: string[], draft?: boolean`. Post malformado quebra no build/teste, nunca em produção.
- **Fallback de idioma:** índice de cada locale lista só posts que têm o arquivo daquele locale; se a URL de um locale sem arquivo for acessada direto, renderiza o idioma disponível com um aviso discreto (`LanguageFallbackNotice`).

## Arquivos a criar

- `mendeshift/content/blog/<slug>/{en,pt}.mdx` — 1 post-semente bilíngue de exemplo.
- `mendeshift/src/lib/blog.ts` — data layer puro (schema zod do frontmatter, `getAllPosts(locale)`, `getPostBySlug(slug, locale)` com fallback, ordenação por data desc, filtro de `draft`, coleta de tags).
- `mendeshift/src/lib/blog.test.ts` — testes Vitest (ver seção Testes; escritos **antes** da implementação — TDD).
- `mendeshift/src/_components/blog/` — `mdx-components.tsx` (mapa MDX→design system), `post-card.tsx`, `post-list.tsx`, `tag-filter.tsx` (client, filtro via query param), `post-meta.tsx`, `language-fallback-notice.tsx`.
- `mendeshift/src/app/[locale]/blog/page.tsx` — índice (lista + filtro por tag `?tag=`).
- `mendeshift/src/app/[locale]/blog/[slug]/page.tsx` — post (`generateStaticParams` a partir das pastas; `generateMetadata` reusando `src/lib/metadata.ts`).
- `mendeshift/src/app/[locale]/blog/[slug]/opengraph-image.tsx` — OG dinâmica por post, seguindo o padrão `opengraph-image.tsx` já usado por rota.
- `mendeshift/src/app/[locale]/blog/feed.xml/route.ts` — Route Handler gerando o RSS/Atom (por locale) no build.
- `mendeshift/src/_components/recent-writing-section.tsx` — seção "escritos recentes" (2–3 posts) reusando o estilo de grid de `WorkSection`.
- `mendeshift/vitest.config.ts` — config Vitest (estreia de testes no projeto).

## Arquivos a modificar

- `mendeshift/src/lib/navigation.ts` — adicionar entrada "Blog".
- `mendeshift/src/app/sitemap.ts` — incluir os posts (por locale).
- `mendeshift/messages/en.json` + `messages/pt.json` — strings de UI do blog (título, "ler mais", "filtrar por tag", aviso de fallback, etc.).
- `mendeshift/src/app/[locale]/page.tsx` — inserir `RecentWritingSection` na composição da home.
- `mendeshift/package.json` — deps novas + script `test`.
- `mendeshift/README.md` — nota curta sobre o blog + mover o roadmap/backlog documentado (RSS→newsletter, polish, tag-pages, busca, comunidade). *(A documentação/escopo completo do GitHub é um ciclo separado, posterior.)*

## Pipeline de render

- **Compilação MDX server-side** compatível com RSC (Next 16 / React 19). Escolha primária: `next-mdx-remote/rsc`. **Validar na implementação** via docs (Context7) — se houver atrito com React 19/React Compiler, fallback pra compilar com `@mdx-js/mdx` (`evaluate`) ou `@content-collections/mdx`.
- **Syntax highlighting:** `rehype-pretty-code` + `shiki`, em build → **zero JS no cliente**. Sem impacto na CSP (sem host externo).
- Elementos MDX mapeados aos componentes/tokens do site → blog consistente com o visual atual (o review estético profundo é um ciclo futuro, à parte).

## Dependências novas (mínimas)

`next-mdx-remote` · `gray-matter` · `rehype-pretty-code` · `shiki` · `vitest` (+ `@vitejs/plugin-react`). `zod` já existe.

## Testes — estreia do TDD no projeto

Não há setup de testes hoje. Introduzir **Vitest** e testar `src/lib/blog.ts` (funções puras — alto valor, fácil manter), escrevendo os testes **antes** da implementação:
- validação/parsing de frontmatter (zod) — inclusive rejeição de post malformado;
- listagem + ordenação por data (desc);
- filtro de `draft`;
- coleta/normalização de tags;
- **lógica de fallback de idioma** (post só-PT some do índice EN; `getPostBySlug` devolve o idioma disponível + flag de fallback).

## Verificação (end-to-end)

1. `pnpm test` — suíte Vitest de `blog.ts` passando (evidência do TDD).
2. `pnpm build` — confirma SSG dos posts e que frontmatter inválido falha o build.
3. `pnpm dev` + preview no browser:
   - `/blog` e `/pt/blog` listam posts; chips de tag filtram (`?tag=`).
   - abrir um post; alternar idioma via `language-toggle` mantém o slug.
   - post só num idioma: some do índice do outro locale; acesso direto mostra o `LanguageFallbackNotice`.
   - home exibe a seção "escritos recentes" com link pros posts; "Blog" aparece no SideNav/mobile-nav.
   - `/blog/feed.xml` (e `/pt/blog/feed.xml`) retornam RSS válido.
4. Conferir `sitemap.xml` inclui os posts e que a OG image do post renderiza.

## Fora de escopo (backlog documentado no README)

Polish de leitura (capa + tempo de leitura + relacionados) · páginas `/blog/tags/[tag]` pra SEO · busca · captura de newsletter (Resend/Upstash) → newsletter ativa (double opt-in, unsubscribe) · comunidade/comentários · documentação/escopo completo do projeto no GitHub (ciclo próprio).