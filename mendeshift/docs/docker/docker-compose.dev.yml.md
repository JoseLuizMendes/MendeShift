# ──────────────────────────────────────────────────────────────────────────────
# docker-compose.dev.yml — Desenvolvimento com hot-reload
#
# Uso:
#   docker compose -f docker-compose.dev.yml up
#
# O código-fonte é montado como volume — edições refletem em tempo real.
# node_modules e .next ficam isolados dentro do container (volumes anônimos)
# para evitar conflitos entre host e container.
# ──────────────────────────────────────────────────────────────────────────────

services:
  web:
    image: node:20-alpine
    container_name: mendeshift-dev
    working_dir: /app
    volumes:
      # Código-fonte montado do host → hot-reload funciona
      - .:/app
      # Isola node_modules e .next dentro do container
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
    # Instala deps e sobe o servidor de dev
    command: sh -c "npm install && npm run dev"
