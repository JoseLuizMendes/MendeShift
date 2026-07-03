import { z } from "zod";

/**
 * Schema de lead — contrato único compartilhado entre o formulário de briefing
 * (client) e a route /api/lead (server).
 *
 * Este shape é também o contrato de integração com CRM (Fase 2): quando um CRM
 * for plugado, o payload validado aqui é enviado como está para o webhook
 * (env CRM_WEBHOOK_URL), sem retrabalho de mapeamento.
 */

export const serviceTypes = ["site", "sistema", "ecommerce", "design"] as const;

export const budgetRanges = [
  "ate-5k",
  "5k-15k",
  "15k-40k",
  "acima-40k",
  "nao-sei",
] as const;

export const timelines = [
  "urgente",
  "1-3-meses",
  "3-mais-meses",
  "sem-prazo",
] as const;

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

/** Labels legíveis para o e-mail de notificação (sempre em PT — o destinatário é o estúdio). */
export const serviceTypeLabels: Record<(typeof serviceTypes)[number], string> = {
  site: "Site ou landing page",
  sistema: "Sistema web / SaaS",
  ecommerce: "Loja virtual / e-commerce",
  design: "Design / identidade visual",
};

export const budgetRangeLabels: Record<(typeof budgetRanges)[number], string> = {
  "ate-5k": "Até R$ 5 mil",
  "5k-15k": "R$ 5 mil a R$ 15 mil",
  "15k-40k": "R$ 15 mil a R$ 40 mil",
  "acima-40k": "Acima de R$ 40 mil",
  "nao-sei": "Ainda não sabe",
};

export const timelineLabels: Record<(typeof timelines)[number], string> = {
  urgente: "Urgente (até 1 mês)",
  "1-3-meses": "1 a 3 meses",
  "3-mais-meses": "Mais de 3 meses",
  "sem-prazo": "Sem prazo definido",
};

/**
 * Serializa o briefing em texto para o deep-link do WhatsApp — fallback quando
 * a API falha e atalho "continuar a conversa" após o envio.
 */
export function leadToWhatsAppText(lead: Partial<Lead>): string {
  const lines = [
    "Olá! Preenchi o briefing no site do MendeShift:",
    lead.name && `Nome: ${lead.name}`,
    lead.company && `Empresa: ${lead.company}`,
    lead.serviceType && `Projeto: ${serviceTypeLabels[lead.serviceType]}`,
    lead.budgetRange && `Investimento: ${budgetRangeLabels[lead.budgetRange]}`,
    lead.timeline && `Prazo: ${timelineLabels[lead.timeline]}`,
    lead.message && `Sobre o projeto: ${lead.message}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export const WHATSAPP_NUMBER = "5527996300333";

export function whatsAppLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
