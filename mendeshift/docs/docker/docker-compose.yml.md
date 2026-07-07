# ──────────────────────────────────────────────────────────────────────────────
# docker-compose.yml — Produção
#
# Uso:
#   docker compose up --build        # build e sobe o container
#   docker compose up -d             # modo detached (background)
#   docker compose down              # derruba o container
# ──────────────────────────────────────────────────────────────────────────────

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    container_name: mendeshift
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/ || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
