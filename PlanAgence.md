# MendeShift: Portfólio → Agência Digital (Review + Plano)

## Contexto

O site atual (mendeshift.vercel.app) é um portfólio pessoal de alta qualidade visual — Next.js 16 App Router, React 19, Tailwind 4, i18n PT/EN, dark theme, GSAP/Lenis, chatbot Gemini com rate limiting. O dono quer transformá-lo no site de sua agência: vender 4 serviços (sites/landing pages, sistemas web/SaaS, e-commerce, design/branding + site), captar leads, e usar a qualidade do próprio site como prova de competência.

**Decisões do dono (confirmadas):**
- Captação MVP: simples (formulário de briefing → e-mail/WhatsApp), **sem banco**; mas o shape do lead deve ser desenhado para integrar CRM depois (documentar).
- Propostas: fora do site por enquanto (PDF manual); futuro = portal do cliente completo (documentar como Fase 3).
- Idiomas: manter PT + EN (já configurado).

## Review do site atual (resumo da crítica)

**Pontos fortes (manter):** estética dark distinta com accent #ff4d4f, tipografia IBM Plex + Bebas Neue, animações sofisticadas (split-flap, scramble), SEO básico bem feito (generateMetadata, OG, hreflang), chatbot com rate limiting sólido, next/image bem usado.

**Problemas a corrigir:**
1. **Posicionamento/copy**: 100% primeira pessoa ("Construo produtos...", "Engenheiro de Produto") — fala com recrutadores, não com clientes. Copy foca em *como* ele trabalha (SonarQube, dívida técnica), não no *resultado para o cliente*. Seção "services" atual ("O que construo") lista skills técnicas, não serviços compráveis.
2. **Conversão**: nenhum formulário de captação — só chat, WhatsApp e mailto. Sem página de contato dedicada, sem briefing estruturado, sem faixas de preço/processo.
3. **SEO**: falta sitemap.ts, robots.ts e JSON-LD; sem keywords de serviço local ("criação de sites em Vitória ES"); domínio vercel.app limita ranking (pré-requisito de negócio: domínio próprio).
4. **Performance**: 22 componentes "use client", GSAP em 16 seções, Lenis + preloader — no teto; seções novas devem ser server components com CSS transitions.

## Plano de implementação — Fase 1 (MVP Agência)

Raiz do app: `mendeshift/` dentro do repo.

### 1. Arquitetura de informação (rotas sob `[locale]`)

| Rota | Ação |
|---|---|
| `/` | Reposicionar: Hero agência → teaser Serviços → Cases → Processo → Sobre/fundador → "Como trabalhamos" → CTA+chat → Colophon |
| `/servicos` | **Nova** — página única com âncoras (`#sites-e-landing-pages`, `#sistemas-web`, `#ecommerce`, `#design-e-branding`). Uma página forte > 4 páginas finas para SEO agora; estruturar `services.items[]` por slug no JSON para permitir split futuro em `/servicos/[slug]` |
| `/projetos` | Reframe como "Cases" com foco em resultado (problema → solução → resultado) |
| `/contato` | **Nova** — formulário de briefing + links diretos + chat |
| `/experience` | Manter rota, tirar da nav principal, linkar a partir do Sobre |

Nav (`src/_components/side-nav.tsx`): Início / Serviços / Cases / Contato.

### 2. Copy / posicionamento (tudo via `messages/pt.json` + `en.json`)

Voz: **estúdio digital com fundador transparente** — "MendeShift é um estúdio de produtos digitais fundado por José Luiz Mendes". Não fingir equipe grande; acesso direto a quem constrói é o diferencial.

- **Hero**: headline de resultado para o cliente (direção: "Sites, sistemas e e-commerces que transformam presença digital em resultado"), tagline "Estúdio digital · Vitória, ES".
- **About** → "O estúdio": história do fundador como ativo de confiança (engenharia = garantia de qualidade).
- **Signals**: virar prova social/números da agência (projetos entregues, anos de engenharia, tempo de resposta).
- **Principles** → "Como trabalhamos": promessas ao cliente (prazo, comunicação, performance) em vez de filosofia de engenharia.
- **Meta tags**: "MendeShift — Estúdio Digital | Sites, Sistemas e E-commerce em Vitória, ES".
- PT primeiro, EN espelhado em lockstep (chave faltando quebra next-intl em runtime).

### 3. Formulário de briefing / leads

- **Stack**: react-hook-form + zod (já instalados) → `POST /api/lead` → **Resend** (free tier 100/dia) → e-mail para josemendess004@gmail.com. Fallback: link "Continuar no WhatsApp" com briefing serializado em `wa.me/5527996300333?text=...`.
- **Schema em `src/lib/leads.ts`** (contrato futuro do CRM — zod compartilhado entre form e API):
  `{ name, email, phone?, company?, serviceType: 'site'|'sistema'|'ecommerce'|'design', budgetRange, timeline, message, locale, source: 'form'|'chatbot', utm?, createdAt }`
- **Documentar no route**: "Fase 2: após e-mail, POST fire-and-forget para `CRM_WEBHOOK_URL`". Sem banco.
- **Anti-spam em camadas**: honeypot + limiter Upstash separado (3 leads/h por IP, reusar padrão de `src/lib/rate-limit.ts`) + validação zod server-side. Turnstile só se spam aparecer.
- UI: `src/_components/briefing-form.tsx` + primitivos de form (`ui/input.tsx`, `ui/select.tsx`, `ui/textarea.tsx`, `ui/label.tsx`) nos tokens existentes.

### 4. Evolução do chatbot

- Reescrever system prompt (extrair para `src/lib/chat-prompt.ts`): identidade da agência, 4 serviços com escopo, processo, prazos indicativos, postura de preço ("a partir de X / proposta sob briefing" — dono fornece faixas; senão "orçamento após briefing").
- Comportamento de captação (prompt-level no MVP): após 2–3 trocas ou intenção de compra, bot pede nome+contato e aponta `/contato` ou WhatsApp.
- `contact-chat.tsx`: quick prompts viram perguntas de cliente ("Quanto custa um site?", "Fazem e-commerce?", "Qual o prazo?") + link fixo "Ir para o briefing" no footer do chat.
- Manter n8n→Gemini fallback e rate limits intactos.

### 5. SEO

- Criar `src/app/sitemap.ts` (todas as rotas × 2 locales com alternates) e `src/app/robots.ts` (disallow `/api/`).
- JSON-LD: `ProfessionalService`/`Organization` + founder no `[locale]/layout.tsx` (makesOffer com os 4 serviços, areaServed Vitória/ES + remoto, sameAs, contactPoint WhatsApp); `CreativeWork` por case em `projetos/[slug]/page.tsx`; `FAQPage` em `/servicos`.
- `generateMetadata` para `/servicos` e `/contato` seguindo o padrão existente do layout.
- OG: Fase 1 = imagem estática de agência (dark + #ff4d4f); Fase 2 = `opengraph-image.tsx` com next/og por case.
- Keywords PT nos headings: "criação de sites em Vitória ES", "landing page profissional", "sistemas web sob medida", "criação de loja virtual", "identidade visual + site". Qualificador local no H1/meta é a maior alavanca.
- **Flag de negócio**: registrar domínio próprio (ex: mendeshift.com.br) — pré-requisito para SEO valer a pena.

### 6. Design system

**Manter tudo** (a estética É o pitch de vendas). **Adicionar** componentes novos compostos dos primitivos existentes (`Section`, `Container`, `Card`, `ActionLink`):
- `services-section.tsx` + `service-card.tsx` (número, título, entregáveis, "a partir de"/"sob consulta", âncora)
- `process-section.tsx` (Briefing → Proposta → Design → Build → Launch → Suporte; split-flap/scramble cabem bem aqui)
- `faq-section.tsx` (accordion com `<details>` estilizado, sem dep nova; espelha FAQPage JSON-LD)
- `testimonials-section.tsx` (data-driven, fica oculto até ter depoimentos reais — nunca lançar com quotes falsos)

**Guardrail de performance**: seções novas = server components + CSS transitions por padrão; GSAP só onde justificar.

### Arquivos — criar
`src/app/[locale]/servicos/page.tsx` · `src/app/[locale]/contato/page.tsx` · `src/app/api/lead/route.ts` · `src/lib/leads.ts` · `src/lib/chat-prompt.ts` · `src/_components/{services-section,service-card,process-section,faq-section,briefing-form,testimonials-section}.tsx` · `src/_components/ui/{input,select,textarea,label}.tsx` · `src/app/sitemap.ts` · `src/app/robots.ts`
Dep nova: `resend`. Envs novas: `RESEND_API_KEY`, `LEAD_TO_EMAIL` (+ futura `CRM_WEBHOOK_URL` documentada).

### Arquivos — modificar
`messages/pt.json` + `messages/en.json` (grosso do trabalho: novos namespaces `services`, `process`, `faq`, `contact_form`; reescritos `meta`, `hero`, `about`, `principles`, `nav`, `chat`) · `src/app/[locale]/layout.tsx` (metadata + JSON-LD) · `src/app/[locale]/page.tsx` (composição) · `side-nav.tsx`, `hero-section.tsx`, `about-section.tsx`, `signals-section.tsx`, `principles-section.tsx`, `cta-section.tsx`, `contact-chat.tsx` · `src/app/api/chat/route.ts` · `src/lib/projects.ts` (campos `serviceType` + `results`) · `src/lib/rate-limit.ts` (segundo limiter para leads)

## Fases futuras (documentar, não implementar agora)

- **Fase 2 — Credibilidade & pipeline**: webhook CRM em `/api/lead` (shape já pronto), depoimentos reais, OG dinâmico, possível split `/servicos/[slug]`, captação estruturada do chatbot postando em `/api/lead` com `source:'chatbot'`, blog opcional para keywords PT.
- **Fase 3 — Portal do cliente**: links de proposta privados (signed URLs, sem login) → depois auth (Clerk/Auth.js) + DB (Neon/Vercel Postgres) + status de projeto + aprovações. Obrigação da Fase 1: só o schema de lead e nota de roadmap no README.

## Riscos

1. Credibilidade do "nós" solo — mitigar com "estúdio fundado por..."
2. Drift PT/EN — verificar ambos locales após cada edição de messages.
3. Deliverability Resend sem domínio próprio — usar domínio onboarding da Resend (ok para notificar a si mesmo); fallback WhatsApp cobre falha total.
4. Preços ausentes — dono precisa fornecer faixas ou tudo fica "sob consulta".
5. Regressão de performance — não multiplicar instâncias GSAP.

## Verificação

1. `npm run dev` → checar `/pt` e `/en`: nav, seções da home, âncoras de `/servicos`, `/projetos`, `/contato`; alternar idioma em toda página (sem erro de chave no console).
2. `npm run build` → pega TS strict; conferir `/sitemap.xml` e `/robots.txt`.
3. Form: envio válido → e-mail chega (dashboard Resend + inbox); honeypot preenchido → aceito silenciosamente sem e-mail; 4º envio rápido → 429; API caída → fallback WhatsApp com briefing serializado.
4. Chatbot: "quanto custa um site?" em PT e EN → resposta com voz de agência + nudge de briefing; rate limit segue amigável.
5. JSON-LD no Google Rich Results Test; OG em preview do Vercel.
6. Lighthouse em `/`, `/servicos`, `/contato` — sem regressão vs. baseline.