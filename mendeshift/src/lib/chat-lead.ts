import { Resend } from "resend";

/**
 * Captação estruturada de leads pelo chatbot (Fase 2).
 *
 * O system prompt instrui o modelo a anexar, quando o usuário fornece
 * nome + contato, um bloco [[LEAD]]{...json...}[[/LEAD]] ao FINAL da
 * resposta. A route /api/chat extrai o bloco (nunca chega ao usuário),
 * notifica o estúdio por e-mail e entrega ao pipeline via CRM_WEBHOOK_URL.
 *
 * O shape é mais leve que o leadSchema do formulário de propósito: no chat
 * o contato pode ser telefone OU e-mail e não há briefing completo.
 */

export type ChatLead = {
  name: string;
  contact: string;
  serviceType?: string;
  summary?: string;
};

const LEAD_BLOCK_RE = /\[\[LEAD\]\]([\s\S]*?)\[\[\/LEAD\]\]/;

/**
 * Remove o bloco [[LEAD]] da resposta e devolve o lead parseado (ou null).
 * Sempre remove o bloco — mesmo com JSON inválido, o usuário nunca o vê.
 */
export function extractChatLead(reply: string): {
  cleanReply: string;
  lead: ChatLead | null;
} {
  const match = reply.match(LEAD_BLOCK_RE);
  if (!match) return { cleanReply: reply, lead: null };

  const cleanReply = reply.replace(LEAD_BLOCK_RE, "").trim();

  try {
    const parsed = JSON.parse(match[1]) as Record<string, unknown>;
    const name =
      typeof parsed.name === "string" ? parsed.name.trim().slice(0, 120) : "";
    const contact =
      typeof parsed.contact === "string"
        ? parsed.contact.trim().slice(0, 200)
        : "";
    if (!name || !contact) return { cleanReply, lead: null };

    return {
      cleanReply,
      lead: {
        name,
        contact,
        serviceType:
          typeof parsed.serviceType === "string" && parsed.serviceType
            ? parsed.serviceType.trim().slice(0, 40)
            : undefined,
        summary:
          typeof parsed.summary === "string" && parsed.summary
            ? parsed.summary.trim().slice(0, 500)
            : undefined,
      },
    };
  } catch {
    return { cleanReply, lead: null };
  }
}

/**
 * Notifica o estúdio (e-mail) e o pipeline (CRM_WEBHOOK_URL).
 * Nunca lança: falha de notificação não pode derrubar a resposta do chat.
 */
export async function notifyChatLead(lead: ChatLead): Promise<void> {
  const createdAt = new Date().toISOString();

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const to = process.env.LEAD_TO_EMAIL ?? "josemendess004@gmail.com";
      const from =
        process.env.LEAD_FROM_EMAIL ?? "MendeShift <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to,
        subject: `[Lead via chat] ${lead.name}`,
        text: [
          "Lead capturado pelo chatbot do site:",
          "",
          `Nome: ${lead.name}`,
          `Contato: ${lead.contact}`,
          lead.serviceType ? `Interesse: ${lead.serviceType}` : null,
          lead.summary ? `Resumo: ${lead.summary}` : null,
          "",
          `Recebido em: ${createdAt}`,
        ]
          .filter((line): line is string => line !== null)
          .join("\n"),
      });
    } catch (error) {
      console.error("Chat lead email error:", error);
    }
  } else {
    console.error("RESEND_API_KEY not configured — chat lead logged only:", lead);
  }

  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
  if (crmWebhookUrl) {
    try {
      await fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "chatbot", ...lead, createdAt }),
        signal: AbortSignal.timeout(3000),
      });
    } catch (error) {
      console.error("Chat lead CRM webhook error:", error);
    }
  }
}
