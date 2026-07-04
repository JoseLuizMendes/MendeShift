import { NextResponse } from "next/server";

import { extractChatLead, notifyChatLead } from "@/lib/chat-lead";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-prompt";
import {
  MAX_HISTORY_MESSAGES,
  MAX_INPUT_CHARS,
  globalLimiter,
  ipLimiter,
} from "@/lib/rate-limit";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages?: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // --- Barreira de conteúdo: rejeita inputs gigantes ---
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg?.role === "user");
    if (
      typeof lastUserMessage?.content === "string" &&
      lastUserMessage.content.length > MAX_INPUT_CHARS
    ) {
      return NextResponse.json(
        { error: `Message too long (max ${MAX_INPUT_CHARS} characters)` },
        { status: 400 }
      );
    }

    // --- Rate limit por IP: barra o usuário abusivo ---
    if (ipLimiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
      const { success, reset } = await ipLimiter.limit(ip);
      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return NextResponse.json(
          { error: "rate_limited" },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }

    // --- Teto global diário: seguro contra ataque distribuído ---
    if (globalLimiter) {
      const { success } = await globalLimiter.limit("global");
      if (!success) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      }
    }

    // Envia apenas as últimas mensagens ao provedor (limita tokens/custo por turno)
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const webhookUrl = process.env.CHATBOT_WEBHOOK_URL;

    // --- MODO 1: Encaminhar para o n8n ---
    if (webhookUrl) {
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: recentMessages }),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error("n8n webhook error:", errorText);
        return NextResponse.json(
          { error: `n8n webhook returned status ${n8nResponse.status}` },
          { status: 500 }
        );
      }

      const n8nData = await n8nResponse.json();
      
      // O n8n deve retornar um JSON com { content: "resposta" } ou { response: "resposta" } ou { output: "resposta" }
      const replyContent = n8nData.content || n8nData.response || n8nData.output;
      if (!replyContent) {
        return NextResponse.json({ error: "No content returned from n8n webhook" }, { status: 500 });
      }

      // Bloco [[LEAD]] (se houver) é extraído antes de responder — o
      // usuário nunca o vê; o estúdio é notificado (e-mail + CRM).
      const { cleanReply, lead } = extractChatLead(String(replyContent));
      if (lead) await notifyChatLead(lead);

      return NextResponse.json({ content: cleanReply });
    }

    // --- MODO 2: Conexão Direta com o Gemini 2.5 Flash-Lite ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    // Mapear histórico para o formato da API do Gemini (roles: user | model)
    const contents = recentMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Persona e posicionamento do estúdio — mantidos em src/lib/chat-prompt.ts
    const systemInstruction = {
      parts: [{ text: CHAT_SYSTEM_PROMPT }],
    };

    const makeRequest = async (model: string) => {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );
    };

    let response = await makeRequest("gemini-2.5-flash-lite");

    if (!response.ok && (response.status === 503 || response.status === 429)) {
      console.warn(`Gemini 2.5 Flash-Lite returned ${response.status}. Falling back to gemini-2.5-flash...`);
      response = await makeRequest("gemini-2.5-flash");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: `Gemini API returned status ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ error: "No response text generated from Gemini" }, { status: 500 });
    }

    // Bloco [[LEAD]] (se houver) é extraído antes de responder — o
    // usuário nunca o vê; o estúdio é notificado (e-mail + CRM).
    const { cleanReply, lead } = extractChatLead(candidateText);
    if (lead) await notifyChatLead(lead);

    return NextResponse.json({ content: cleanReply });
  } catch (error) {
    console.error("Chat route error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
