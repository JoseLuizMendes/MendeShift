import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  budgetRangeLabels,
  leadSchema,
  serviceTypeLabels,
  timelineLabels,
} from "@/lib/leads";
import { leadLimiter } from "@/lib/rate-limit";

/**
 * Captação de leads do formulário de briefing.
 *
 * MVP: valida com zod, descarta bots via honeypot e notifica o estúdio por
 * e-mail (Resend). Sem banco de dados.
 *
 * Fase 2 (CRM): após o envio do e-mail, fazer um POST fire-and-forget do
 * payload validado (o objeto `lead` abaixo, já no shape do contrato em
 * src/lib/leads.ts) para o webhook do CRM via env CRM_WEBHOOK_URL.
 *
 * Envs: RESEND_API_KEY (obrigatória), LEAD_TO_EMAIL (destino; default abaixo),
 * LEAD_FROM_EMAIL (remetente verificado no Resend; default onboarding).
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const lead = parsed.data;

    // --- Honeypot: bots preenchem o campo escondido; aceita em silêncio e descarta ---
    if (lead.website) {
      return NextResponse.json({ ok: true });
    }

    // --- Rate limit por IP (limiter próprio, separado do chat) ---
    if (leadLimiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
      const { success, reset } = await leadLimiter.limit(ip);
      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return NextResponse.json(
          { error: "rate_limited" },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "email_not_configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const to = process.env.LEAD_TO_EMAIL ?? "josemendess004@gmail.com";
    const from = process.env.LEAD_FROM_EMAIL ?? "MendeShift <onboarding@resend.dev>";

    const createdAt = new Date().toISOString();

    const textLines = [
      `Novo briefing recebido pelo site (${lead.source}, ${lead.locale}):`,
      "",
      `Nome: ${lead.name}`,
      `E-mail: ${lead.email}`,
      lead.phone ? `WhatsApp: ${lead.phone}` : null,
      lead.company ? `Empresa: ${lead.company}` : null,
      `Projeto: ${serviceTypeLabels[lead.serviceType]}`,
      `Investimento: ${budgetRangeLabels[lead.budgetRange]}`,
      `Prazo: ${timelineLabels[lead.timeline]}`,
      "",
      "Sobre o projeto:",
      lead.message,
      "",
      lead.utm?.source
        ? `Origem: ${lead.utm.source} / ${lead.utm.medium ?? "-"} / ${lead.utm.campaign ?? "-"}`
        : null,
      `Recebido em: ${createdAt}`,
    ].filter((line): line is string => line !== null);

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `[Briefing] ${lead.name} — ${serviceTypeLabels[lead.serviceType]}`,
      text: textLines.join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "email_failed" }, { status: 500 });
    }

    // Fase 2 (CRM): postar `{ ...lead, createdAt }` para process.env.CRM_WEBHOOK_URL aqui.

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead route error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
