# ──────────────────────────────────────────────────────────────────────────────
# MendeShift — Dockerfile multi-stage
#
# Etapas:
#   1. deps    → instala dependências (cache de camadas)
#   2. builder → build de produção do Next.js
#   3. runner  → imagem mínima com apenas o .next/standalone
#
# O código-fonte .tsx/.ts NÃO entra na imagem final. Apenas o JS compilado
# e os assets públicos são copiados para o estágio runner.
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Dependências ──────────────────────────────────────────────────────
FROM node:20-alpine AS deps

# Dependências nativas para pacotes nativos (sharp, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências instaladas no stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia o código-fonte completo para fazer o build
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# ── Stage 3: Runner (imagem final de produção) ─────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usuário sem privilégios de root (boa prática de segurança)
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Assets públicos (imagens, fontes, etc.)
COPY --from=builder /app/public ./public

# Bundle standalone gerado pelo Next.js (sem o código-fonte)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Arquivos estáticos (CSS, JS do cliente, imagens otimizadas)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# server.js é gerado automaticamente pelo output: 'standalone'
CMD ["node", "server.js"]
