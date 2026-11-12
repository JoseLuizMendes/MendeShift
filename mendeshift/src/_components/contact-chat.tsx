"use client";

import { FormEvent, KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Terminal } from "lucide-react";
import { useTranslations } from "@/i18n/context";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { Card } from "@/_components/ui/card";
import { QuestionAccordion } from "@/_components/ui/question-accordion";
import { TerminalGhost } from "./terminal-ghost";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type QuickPrompt = { label: string; prompt: string; answer: string };

const ghostExitMs = 440;

export function ContactChat() {
  const t = useTranslations("contact");
  const quickPrompts = t.raw("quick_prompts") as QuickPrompt[];

  const initialMessages: Message[] = useMemo(
    () => [{ id: "1", role: "assistant", content: t("initial_message"), timestamp: new Date() }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  function handleDisclosureClick(event: MouseEvent<HTMLElement>) {
    const disclosure = disclosureRef.current;
    if (!disclosure?.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    if (closeTimerRef.current !== undefined) return;
    disclosure.dataset.closing = "";
    closeTimerRef.current = window.setTimeout(() => {
      disclosure.open = false;
      delete disclosure.dataset.closing;
      closeTimerRef.current = undefined;
    }, ghostExitMs);
  }

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const panel = event.currentTarget;
    const bounds = panel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    panel.style.setProperty("--ghost-x", `${x * 22}px`);
    panel.style.setProperty("--ghost-y", `${y * 14}px`);
  }
  // Contador monotônico de ids: derivar o id de messages.length colidia em
  // envios rápidos e após o ramo 429 (duas mensagens com o mesmo length+1),
  // gerando keys React duplicadas. "1" é o id da mensagem inicial.
  const nextIdRef = useRef(2);
  const nextId = () => String(nextIdRef.current++);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bootRun, setBootRun] = useState(0);
  const [hasFocusedComposer, setHasFocusedComposer] = useState(false);
  useEffect(() => {
    // Rola apenas a conversa e preserva a posição da página.
    if (messages.length === 1) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({ top: container.scrollHeight, behavior: reduceMotion ? "instant" : "smooth" });
  }, [messages, isTyping]);

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
            id: nextId(),
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
          id: nextId(),
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
          id: nextId(),
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
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: nextId(),
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
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <details
      ref={disclosureRef}
      className="group/assistant mt-6"
      onToggle={(event) => {
        if (!event.currentTarget.open) return;
        setHasFocusedComposer(false);
        setBootRun((run) => run + 1);
      }}
    >
      <summary onClick={handleDisclosureClick} className="flex w-fit max-w-full cursor-pointer list-none items-center gap-3 border border-accent/45 bg-accent/10 px-4 py-3 text-sm font-medium text-foreground transition-colors interaction-motion hover:border-accent hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
        <Terminal aria-hidden="true" className="size-4 shrink-0 text-accent" />
        <span className="grid">
          <span className="col-start-1 row-start-1 group-open/assistant:invisible">{t("assistant_details")}</span>
          <span className="invisible col-start-1 row-start-1 group-open/assistant:visible">{t("assistant_close")}</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-accent transition-transform interaction-motion group-open/assistant:rotate-180" />
      </summary>
      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,22rem)]">
        {/* Chatbot Principal - Left Side */}
        <div className="min-w-0 lg:relative lg:min-h-[29rem]">
          <Card
            className="contact-chat-panel flex h-[min(33rem,80svh)] min-h-[24rem] flex-col overflow-hidden lg:absolute lg:inset-0 lg:h-auto"
            onPointerMove={followPointer}
            onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty("--ghost-x");
              event.currentTarget.style.removeProperty("--ghost-y");
            }}
          >
            <div className="terminal-titlebar">
              <span className="terminal-window-lights" aria-hidden="true"><i /><i /><i /></span>
              <p className="min-w-0 font-mono text-xs font-medium text-foreground">{t("virtual_assistant")}</p>
            </div>

            <div key={bootRun} className="terminal-boot">
              <div className="min-w-0">
                <p className="terminal-command" data-caret-transferred={hasFocusedComposer ? "" : undefined} aria-hidden="true">
                  <span className="text-accent">$</span> install mendeshift
                </p>
                <p className="terminal-ready"><span aria-hidden="true">✓ </span>{t("terminal_ready")}</p>
              </div>
              <TerminalGhost label={t("terminal_mascot")} />
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent
              className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
            >
              {messages.length === 1 && (
                <p className="terminal-intro text-sm leading-relaxed text-foreground/90">{t("initial_message")}</p>
              )}
              <div role="log" aria-label={t("virtual_assistant")} className="flex flex-col gap-3">
                {messages.slice(1).map((message) => (
                  <div
                    key={message.id}
                    className={`contact-chat-message terminal-message ${message.role === "user" ? "terminal-message-user" : ""}`}
                  >
                    <span aria-hidden="true">{message.role === "user" ? "$" : "↳"}</span>
                    <p className="wrap-anywhere whitespace-pre-wrap">
                      <span className="sr-only">{t(message.role === "user" ? "message_from_you" : "virtual_assistant")}. </span>
                      {message.content}
                    </p>
                  </div>
                ))}
                {isTyping && (
                  <div className="contact-chat-message flex justify-start" role="status">
                    <span className="font-mono text-xs text-muted-foreground">
                      <span aria-hidden="true" className="mr-2 text-accent">↳</span>{t("typing")}
                    </span>
                  </div>
                )}
              </div>
              {messages.length === 1 && !isTyping && (
                <div className="contact-chat-start mt-4 flex shrink-0 flex-wrap gap-2">
                  {quickPrompts.slice(0, 3).map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      data-selected={inputValue === item.prompt ? "" : undefined}
                      className="min-h-11 border border-border bg-background/80 px-3 py-2 text-left text-xs text-foreground transition-colors interaction-motion hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent data-selected:border-accent/60 data-selected:bg-accent/10 data-selected:text-accent"
                      onClick={() => {
                        setInputValue(item.prompt);
                        inputRef.current?.focus({ preventScroll: true });
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              data-draft={inputValue.trim() ? "" : undefined}
              className="contact-chat-composer relative flex shrink-0 items-center gap-2 border-t border-border/50 px-4 py-3 sm:gap-3 sm:px-5"
            >
              <span aria-hidden="true" className="font-mono text-accent">$</span>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setHasFocusedComposer(true)}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")} aria-label={t("placeholder")}
                rows={1}
                data-lenis-prevent
                className="no-scrollbar field-sizing-content max-h-28 min-h-11 min-w-0 flex-1 resize-none overscroll-contain border border-border/50 bg-muted/50 px-3 py-2.5 font-mono text-base text-foreground transition-colors interaction-motion placeholder:text-muted-foreground focus:border-accent focus:outline-none sm:px-4 sm:text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label={t("send_message")}
                className="contact-chat-send group flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-accent-foreground transition-[background-color,opacity] interaction-motion enabled:hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
              >
                <span aria-hidden="true">
                  <BitmapChevron className="-rotate-45 transition-transform interaction-motion motion-safe:group-hover:rotate-0 motion-safe:group-focus-visible:rotate-0" />
                </span>
              </button>
            </form>
          </Card>
        </div>

        {/* Coluna lateral: Perguntas rápidas + Contato direto */}
        <div className="flex w-full flex-col lg:min-h-[29rem]">
          {/* Quick Actions */}
          <section className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t("quick_label")}
              </p>
            </div>
            <QuestionAccordion
              className="flex-1 justify-between"
              items={quickPrompts.map(({ label, prompt, answer }) => ({
                question: label,
                answer,
                content: (
                  <>
                    <p className="text-[11px] text-muted-foreground">{prompt}</p>
                    <p>{answer}</p>
                  </>
                ),
              }))}
            />
          </section>
        </div>
      </div>
    </details>
  );
}
