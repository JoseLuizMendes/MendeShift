"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Linkedin, MessageCircle } from "lucide-react";

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
  {
    label: "Disponibilidade",
    prompt:
      "Qual sua disponibilidade atual para iniciar um projeto e qual a sua carga horária semanal?",
  },
  {
    label: "Stack",
    prompt:
      "Quais tecnologias, frameworks e ferramentas você domina e utiliza com mais frequência nos projetos?",
  },
  {
    label: "Orçamento",
    prompt:
      "Como funciona seu modelo de orçamento, formas de cobrança e como você costuma estruturar propostas?",
  },
  {
    label: "Prazo",
    prompt:
      "Qual é o prazo médio para entregar diferentes tipos de projetos, como landing pages ou aplicações completas?",
  },
];

const quickAnswersByLabel: Record<string, string> = {
  Disponibilidade:
    "Atualmente estou disponível para novos projetos. Consigo começar imediatamente ou alinhar uma data que faça sentido para o escopo e sua urgência.",
  Stack:
    "Trabalho principalmente com React, Next.js, TypeScript, Node.js e tecnologias modernas de frontend. Também tenho experiência com design systems, animações e arquitetura voltada a produto.",
  Orçamento:
    "O orçamento é definido a partir da complexidade e do escopo. Normalmente trabalho com valores fechados por projeto ou hourly rate em casos específicos, sempre com transparência no que está incluído.",
  Prazo:
    "Landing pages costumam levar de 1 a 2 semanas; produtos mais complexos, entre 4 e 8 semanas. O foco é sempre equilibrar velocidade com qualidade e manutenção a longo prazo.",
};

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
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    quickPrompts[0]?.label ?? null,
  );
  const [scrambleTokens, setScrambleTokens] = useState({
    whatsapp: 0,
    linkedin: 0,
  });

  const triggerScramble = (key: "whatsapp" | "linkedin") => {
    setScrambleTokens((current) => ({
      ...current,
      [key]: current[key] + 1,
    }));
  };

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

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,22rem)] lg:items-start lg:gap-8">
      {/* Chatbot Principal - Left Side */}
      <div ref={chatRef}>
        <Card className="flex h-125 flex-col overflow-hidden lg:h-152.5">
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
              className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-border/50 bg-muted/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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

      {/* Coluna lateral: Perguntas rápidas + Contato direto */}
      <div className="flex w-full flex-col gap-8 lg:justify-self-end">
        {/* Quick Actions */}
        <section className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Perguntas Rápidas
          </p>
          <div className="space-y-3">
            {quickPrompts.map((item) => {
              const isOpen = openQuestion === item.label;
              const answer = quickAnswersByLabel[item.label];

              return (
                <div
                  key={item.label}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card/40"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : item.label)
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="font-mono text-xs text-foreground">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t border-border/60 px-4 py-3">
                      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </p>
                      {answer && (
                        <p className="font-mono text-xs leading-relaxed text-foreground">
                          {answer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Links */}
        <section className="flex w-full max-w-sm flex-col gap-4 self-start rounded-[28px] border border-border/60 bg-card/60 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Contato Direto
          </p>
          <div className="flex flex-col gap-2.5">
            <ActionLink
              href="https://wa.me/5521964868505"
              variant="ghost"
              className="group h-14 w-full justify-between rounded-full border border-border/60 bg-background/35 px-3 text-[11px] tracking-[0.22em] text-foreground transition-all duration-300 hover:border-accent/70 hover:bg-accent/5 hover:text-accent"
              onMouseEnter={() => triggerScramble("whatsapp")}
              onFocus={() => triggerScramble("whatsapp")}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground transition-colors duration-300 group-hover:border-accent/70 group-hover:text-accent">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <ScrambleTextOnHover
                  text="WhatsApp"
                  as="span"
                  duration={0.7}
                  className="text-[11px] transition-colors duration-300"
                  triggerToken={scrambleTokens.whatsapp}
                />
              </span>
              <BitmapChevron className="w-4 h-5 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
            </ActionLink>
            <ActionLink
              href="https://www.linkedin.com/in/josé-luiz-dos-santos-azeredo-mendes/"
              variant="ghost"
              className="group h-14 w-full justify-between rounded-full border border-border/60 bg-background/35 px-3 text-[11px] tracking-[0.22em] text-foreground transition-all duration-300 hover:border-accent/70 hover:bg-accent/5 hover:text-accent"
              onMouseEnter={() => triggerScramble("linkedin")}
              onFocus={() => triggerScramble("linkedin")}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground transition-colors duration-300 group-hover:border-accent/70 group-hover:text-accent">
                  <Linkedin className="h-4 w-4" />
                </span>
                <ScrambleTextOnHover
                  text="LinkedIn"
                  as="span"
                  duration={0.7}
                  className="text-[11px] transition-colors duration-300"
                  triggerToken={scrambleTokens.linkedin}
                />
              </span>
              <BitmapChevron className="w-4 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
            </ActionLink>
          </div>
        </section>
      </div>
    </div>
  );
}

