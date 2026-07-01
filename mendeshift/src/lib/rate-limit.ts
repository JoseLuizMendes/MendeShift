import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting do chatbot Gemini.
 *
 * Ativa apenas quando as credenciais do Upstash Redis estão presentes no ambiente
 * (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Sem elas — por exemplo em dev
 * local — os limiters ficam nulos e a route simplesmente pula a checagem, mantendo o
 * chat funcional.
 *
 * Duas barreiras:
 *  - ipLimiter:     10 req/hora por IP (sliding window) — barra o usuário abusivo.
 *  - globalLimiter: 500 req/dia no site inteiro (fixed window) — seguro contra ataque
 *                   distribuído/IPs rotativos que protege a cota do Gemini.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const ipLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "chat_ip",
      analytics: true,
    })
  : null;

export const globalLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(500, "1 d"),
      prefix: "chat_global",
      analytics: true,
    })
  : null;

/** Tamanho máximo (em caracteres) de uma mensagem de usuário. */
export const MAX_INPUT_CHARS = 2000;

/** Quantas mensagens do histórico são enviadas ao Gemini por turno. */
export const MAX_HISTORY_MESSAGES = 10;
