# MendeShift

Site agência-portfólio pessoal: vitrine dos meus projetos, captação de lead (formulário de briefing + chatbot com IA) e terreno onde testo decisões de performance e arquitetura.

**[mende-shift.vercel.app](https://mende-shift.vercel.app)** — Real Experience Score de 99/100 no Vercel Speed Insights, medido com usuários reais: 8 ms de interação até a próxima pintura, zero layout shift cumulativo, TTFB de 0,03 s.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Estilo | Tailwind CSS 4 |
| Animação | GSAP + Lenis — sem lib de scroll pronta, pra manter o bundle pequeno |
| i18n | next-intl (PT/EN) |
| Formulários | React Hook Form + Zod |
| E-mail / leads | Resend |
| Rate limiting | Upstash Redis |
| Observabilidade | Vercel Analytics + Speed Insights |
| Deploy | Vercel · build Docker multi-stage |

## O que tem

- **Chatbot de contato** com Gemini — rate limit por IP, teto diário global, e captação automática de lead direto da conversa.
- **Formulário de briefing** com honeypot anti-spam, rate limit próprio e fallback por WhatsApp se a API cair.
- Coordenação entre componentes por eventos de DOM, sem contexto global — uma das decisões por trás do Real Experience Score.

## Rodando

Requer **pnpm**. O app fica em `mendeshift/`.

```bash
cd mendeshift
pnpm install
pnpm dev
```

Variáveis de ambiente (Gemini, Resend, Upstash) e detalhes de cada feature: ver [`mendeshift/README.md`](mendeshift/README.md).

## Licença

MIT.
