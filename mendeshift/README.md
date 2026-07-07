This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Chatbot & Rate Limiting

O chatbot de contato usa uma API route (`src/app/api/chat/route.ts`) que chama o Gemini
com uma key **server-side** (nunca exposta no browser).

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública canônica (ex.: `https://mendeshift.com.br`). Alimenta canonicals, sitemap, robots, og:url e JSON-LD. Sem ela, cai no fallback `https://mendeshift.vercel.app`. Trocar o domínio = mudar esta env na Vercel e redeployar (sem commit). Ver [docs/go-live-dominio-seo.md](docs/go-live-dominio-seo.md). |
| `GEMINI_API_KEY` | Sim (se não usar n8n) | Key do Google AI Studio para o Gemini. |
| `CHATBOT_WEBHOOK_URL` | Não | Se definida, encaminha o chat para um webhook do n8n em vez do Gemini direto. |
| `UPSTASH_REDIS_REST_URL` | Não | URL do Upstash Redis para ativar o rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Não | Token do Upstash Redis. |

### Proteção contra abuso

Quando as credenciais do Upstash Redis estão presentes, a route aplica:

- **Limite por IP:** 5 requisições/hora por IP (sliding window) — barra o usuário abusivo.
- **Teto global diário:** 200 requisições/dia no site inteiro (fixed window) — seguro contra
  ataque distribuído com IPs rotativos, protegendo a cota do Gemini.
- **Limite de conteúdo:** mensagens acima de 2000 caracteres são rejeitadas e apenas as últimas
  10 mensagens do histórico são enviadas ao provedor por turno.

Sem as variáveis do Upstash (ex. dev local) o rate limiting é ignorado e o chat funciona normal.

### Captação de lead pelo chat

Quando o visitante informa nome + contato na conversa, o modelo anexa um bloco
`[[LEAD]]{...}[[/LEAD]]` ao final da resposta (instrução 10 de `src/lib/chat-prompt.ts`).
A route extrai o bloco antes de responder (o usuário nunca o vê) e `src/lib/chat-lead.ts`
notifica o estúdio por e-mail e posta no `CRM_WEBHOOK_URL` com `source: "chatbot"`.

> Dica de custo: mantenha o billing **desligado** no Google AI Studio. Assim, quando a cota
> gratuita acabar, a API retorna erro em vez de gerar fatura — teto natural sem surpresa.

## Captação de Leads (Briefing)

O formulário de briefing (`/contato`) envia leads pela route `src/app/api/lead/route.ts`,
que valida com o schema canônico em `src/lib/leads.ts` e notifica o estúdio por e-mail
via [Resend](https://resend.com).

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `RESEND_API_KEY` | Sim | Key do Resend para envio do e-mail de notificação. |
| `LEAD_TO_EMAIL` | Não | E-mail de destino (default: josemendess004@gmail.com). |
| `LEAD_FROM_EMAIL` | Não | Remetente verificado no Resend (default: onboarding@resend.dev). |
| `CRM_WEBHOOK_URL` | Não | Se definida, cada lead (form e chatbot) é postado nela após o e-mail — aponte para um fluxo n8n que encaminhe para Sheets/Notion/WhatsApp. |

### Proteção contra spam

- **Honeypot:** campo escondido `website` — se preenchido (bot), o envio é aceito em silêncio e descartado.
- **Limite por IP:** 3 envios/hora (Upstash, limiter separado do chat — `lead_ip`).
- **Validação zod** no servidor (schema compartilhado com o client).
- **Fallback WhatsApp:** se a API falhar, o formulário oferece link `wa.me` com o briefing serializado.

## Medição & Presença

- **Vercel Analytics + Speed Insights:** montados no layout. Evento de conversão
  `lead_submitted` (com `serviceType`, `budgetRange`, `locale`) disparado no sucesso do
  briefing — acompanhar em Vercel → Analytics → Events.
- **Domínio próprio + Search Console + Business Profile (ações do dono):** passo a passo
  completo em **[docs/go-live-dominio-seo.md](docs/go-live-dominio-seo.md)** — registro do
  domínio, conexão na Vercel, `NEXT_PUBLIC_SITE_URL`, verificação do Search Console por **DNS TXT**
  (propriedade de Domínio, cobre todos os subdomínios) e criação do perfil no Google Business.
  Junto com o domínio próprio, o Business Profile é a maior alavanca de SEO local
  ("criação de sites em Vitória ES").

## Roadmap

- **Fase 1 (atual) — MVP Agência:** posicionamento de estúdio, `/servicos`, `/contato` com briefing,
  SEO (sitemap, robots, JSON-LD), chatbot com voz de agência.
- **Fase 2 — Credibilidade & pipeline:** integração CRM via `CRM_WEBHOOK_URL` (payload já no
  contrato de `src/lib/leads.ts`), depoimentos reais (`testimonials-section.tsx`, já pronta e
  oculta até ter quotes reais), OG images dinâmicas por case, captação estruturada pelo chatbot
  (`source: "chatbot"`), possível split de `/servicos/[slug]`, blog para keywords PT.
- **Fase 3 — Portal do cliente:** links de proposta privados (signed URLs) → autenticação +
  banco (Neon/Vercel Postgres) + status de projeto + aprovações.
- **Pré-requisito de negócio:** registrar domínio próprio (ex.: mendeshift.com.br) — SEO em
  `vercel.app` tem teto baixo. `metadataBase`, sitemap, robots e JSON-LD já leem de
  `NEXT_PUBLIC_SITE_URL`, então migrar é só setar essa env na Vercel (sem commit). Ver
  [docs/go-live-dominio-seo.md](docs/go-live-dominio-seo.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
