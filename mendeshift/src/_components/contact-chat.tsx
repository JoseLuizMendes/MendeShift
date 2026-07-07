"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/i18n/context";
import gsap from "gsap";
import { ChevronDown, Linkedin, MessageCircle } from "lucide-react";

import { prefersReducedMotion } from "@/lib/motion";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { ActionLink } from "@/_components/ui/action-link";
import { Card } from "@/_components/ui/card";
import { FileText } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type QuickPrompt = { label: string; prompt: string; answer: string };

export function ContactChat() {
  const t = useTranslations("contact");
  const quickPrompts = t.raw("quick_prompts") as QuickPrompt[];

  const initialMessages: Message[] = useMemo(
    () => [{ id: "1", role: "assistant", content: t("initial_message"), timestamp: new Date() }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
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
    // Rola SÓ o container interno de mensagens. scrollIntoView rolava
    // também a janela — toda montagem da home arrastava a página inteira
    // até o chat (o bug do "caio no chatbot ao voltar").
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatRef.current) return;
    if (prefersReducedMotion()) return;

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
            toggleActions: "play none none none",
          },
        });
      }
    }, chatRef);

    return () => ctx.revert();
  }, []);

  const simulateResponse = async (userMessage: string, currentMessages: Message[]) => {
    setIsTyping(true);
    try {
      const apiMessages = [
        ...currentMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userMessage },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: (prev.length + 1).toString(),
            role: "assistant",
            content: t("rate_limit_response"),
            timestamp: new Date(),
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch chat response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          role: "assistant",
          content: t("fallback_response"),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: (messages.length + 1).toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    simulateResponse(trimmed, messages);
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,22rem)] lg:items-start lg:gap-8">
      {/* Chatbot Principal - Left Side */}
      <div ref={chatRef}>
        <Card className="flex flex-col overflow-hidden sm:h-125 lg:h-192.5">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-border/50 px-4 py-4 sm:px-5">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-mono text-sm text-accent">
                JL
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-foreground">
                {t("virtual_assistant")}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {t("online")}
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            data-lenis-prevent
            className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
          >
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 font-mono text-sm leading-relaxed sm:max-w-[85%] ${message.role === "user"
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
            </div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 border-t border-border/50 px-4 py-4 sm:px-5"
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              rows={1}
              data-lenis-prevent
              className="no-scrollbar max-h-32 min-h-11 flex-1 resize-none overscroll-contain rounded-xl border border-border/50 bg-muted/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label={t("send_message")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-all hover:scale-[1.02] hover:bg-accent/90 disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg
                aria-hidden="true"
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
      <div className="flex w-full flex-col gap-6 sm:gap-8 lg:justify-self-end">
        {/* Quick Actions */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("quick_label")}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {quickPrompts.length} tópicos
            </p>
          </div>
          <div className="space-y-2">
            {quickPrompts.map((item) => {
              const isOpen = openQuestion === item.label;

              return (
                <div
                  key={item.label}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen
                    ? "border-accent/50 bg-card/60"
                    : "border-border/50 bg-card/30 hover:border-accent/35 hover:bg-card/50"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? null : item.label)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span
                        className={`font-mono text-xs font-medium transition-colors duration-200 ${isOpen ? "text-accent" : "text-foreground"
                          }`}
                      >
                        {item.label}
                      </span>
                      {/* Preview truncado — affordance de conteúdo escondido */}
                      <span
                        className={`font-mono text-[10px] leading-relaxed text-muted-foreground transition-all duration-300 ${isOpen ? "max-h-0 overflow-hidden opacity-0" : "max-h-8 opacity-100"
                          }`}
                      >
                        {item.answer.slice(0, 62)}…
                      </span>
                    </div>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 transition-all duration-300 ${isOpen
                          ? "rotate-180 text-accent/70"
                          : "text-muted-foreground/40"
                        }`}
                    />
                  </button>

                  {/* Animated expand — CSS grid trick */}
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2.5 border-t border-border/40 px-4 py-3.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Pergunta
                        </p>
                        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground/80">
                          {item.prompt}
                        </p>
                        {item.answer && (
                          <>
                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                              Resposta
                            </p>
                            <p className="font-mono text-xs leading-relaxed text-foreground/90">
                              {item.answer}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Links */}
        <section className="flex w-full flex-col gap-4 self-start rounded-[28px] border border-border/60 bg-card/60 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t("direct_label")}
          </p>
          <div className="flex flex-col gap-2.5">
            <ActionLink
              href="https://wa.me/5527996300333"
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

        {/* Briefing CTA — caminho principal de conversão */}
        <section className="flex w-full flex-col gap-3 rounded-[28px] border border-accent/40 bg-accent/5 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t("briefing_label")}
          </p>
          <ActionLink
            href="/contato"
            className="group h-14 w-full justify-between rounded-full border border-accent/50 bg-background/35 px-3 text-[11px] tracking-[0.22em] text-accent transition-all duration-300 hover:border-accent hover:bg-accent/10"
          >
            <span className="flex items-center gap-3 whitespace-break-spaces">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/50 bg-card/80 text-accent">
                <FileText className="h-4 w-4" />
              </span>
              <ScrambleTextOnHover
                text={t("briefing_cta")}
                as="span"
                duration={0.7}
                className="text-[11px] transition-colors duration-300"
              />
            </span>
            <BitmapChevron className="w-4 transition-transform duration-400 ease-emphasis group-hover:rotate-45 group-hover:duration-1000" />
          </ActionLink>
        </section>
      </div>
    </div>
  );
}
