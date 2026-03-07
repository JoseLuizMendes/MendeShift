"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: "Disponibilidade", prompt: "Qual sua disponibilidade atual?" },
  { label: "Stack", prompt: "Quais tecnologias você domina?" },
  { label: "Orçamento", prompt: "Como funciona seu processo de orçamento?" },
  { label: "Prazo", prompt: "Qual o prazo médio para um projeto?" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Olá! Sou o assistente virtual do José. Como posso ajudar você hoje?",
    timestamp: new Date(),
  },
];

export function ContactChat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatRef.current) return;

    const ctx = gsap.context(() => {
      if (chatRef.current) {
        gsap.from(chatRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: chatRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, chatRef);

    return () => ctx.revert();
  }, []);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        disponibilidade:
          "Atualmente estou disponível para novos projetos! Posso começar imediatamente ou agendar para uma data que funcione melhor para você.",
        stack: "Trabalho principalmente com React, Next.js, TypeScript, Node.js e diversas tecnologias de frontend moderno. Também tenho experiência com design systems e animações.",
        orçamento:
          "O orçamento é calculado com base na complexidade e escopo do projeto. Geralmente trabalho com valores fixos por projeto ou hourly rate. Me conta mais sobre sua ideia!",
        prazo: "O prazo varia de acordo com o projeto. Landing pages levam de 1-2 semanas, aplicações mais complexas de 4-8 semanas. Sempre priorizo qualidade sobre velocidade.",
      };

      const lowerMessage = userMessage.toLowerCase();
      let response =
        "Obrigado pela mensagem! Para uma resposta mais detalhada, entre em contato diretamente pelo email josemendess004@gmail.com ou LinkedIn.";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    simulateResponse(trimmed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
      {/* Chatbot Principal - Left Side */}
      <div ref={chatRef}>
        <Card className="flex h-[500px] flex-col overflow-hidden lg:h-[560px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-mono text-sm text-accent">
                JL
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-foreground">
                Assistente Virtual
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                Online agora
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 font-mono text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 border-t border-border/50 px-5 py-4"
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border/50 bg-muted/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-all hover:scale-[1.02] hover:bg-accent/90 disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </Card>
      </div>

      {/* Supplementary Content - Right Side */}
      <div className="flex flex-col gap-6">
        {/* Quick Actions */}
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Perguntas Rápidas
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickPrompts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickPrompt(item.prompt)}
                style={{ opacity: 1 }}
                className="rounded-xl border border-border bg-card px-4 py-4 text-left font-mono text-xs text-foreground transition-all hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Links */}
        <div className="mt-auto">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Contato Direto
          </p>
          <div className="flex flex-col gap-3">
            <ActionLink
              href="mailto:josemendess004@gmail.com"
              className="group w-full justify-start"
            >
              <ScrambleTextOnHover
                text="josemendess004@gmail.com"
                as="span"
                duration={0.7}
              />
              <BitmapChevron className="ml-auto transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
            </ActionLink>
            <ActionLink
              href="https://wa.me/5521964868505"
              className="group w-full justify-start"
            >
              <ScrambleTextOnHover text="WhatsApp" as="span" duration={0.7} />
              <BitmapChevron className="ml-auto transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
            </ActionLink>
            <ActionLink
              href="https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/"
              variant="ghost"
              className="justify-start"
            >
              LinkedIn
              <span className="ml-1">↗</span>
            </ActionLink>
          </div>
        </div>
      </div>
    </div>
  );
}

