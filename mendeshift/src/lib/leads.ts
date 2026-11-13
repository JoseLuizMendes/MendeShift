import { z } from "zod";

import { budgetRanges, serviceTypes, timelines } from "./lead-options";

export * from "./lead-options";

/**
 * Schema de lead — contrato único compartilhado entre o formulário de briefing
 * (client) e a route /api/lead (server).
 *
 * Este shape é também o contrato de integração com CRM (Fase 2): quando um CRM
 * for plugado, o payload validado aqui é enviado como está para o webhook
 * (env CRM_WEBHOOK_URL), sem retrabalho de mapeamento.
 */

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  serviceType: z.enum(serviceTypes),
  budgetRange: z.enum(budgetRanges),
  timeline: z.enum(timelines),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["pt", "en"]).default("pt"),
  source: z.enum(["form", "chatbot"]).default("form"),
  utm: z
    .object({
      source: z.string().max(100).optional(),
      medium: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
    })
    .optional(),
  /** Honeypot — humanos nunca preenchem; bots sim. Descartado antes do envio. */
  website: z.string().max(200).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
