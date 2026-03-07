"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BitmapChevron } from "@/_components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/_components/scramble-text";
import { ActionLink } from "@/_components/ui/action-link";
import { Container } from "@/_components/ui/container";
import { Card } from "@/_components/ui/card";
import { Eyebrow, Section } from "@/_components/ui/section";

gsap.registerPlugin(ScrollTrigger);

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

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const children = headlineRef.current.querySelectorAll(":scope > *");
        gsap.from(children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

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

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".quick-card");
        gsap.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses: Record<string, string> = {
        disponibilidade: "Atualmente estou disponível para novos projetos! Posso começar imediatamente ou agendar para uma data que funcione melhor para você.",
        stack: "Trabalho principalmente com React, Next.js, TypeScript, Node.js e diversas tecnologias de frontend moderno. Também tenho experiência com design systems e animações.",
        orçamento: "O orçamento é calculado com base na complexidade e escopo do projeto. Geralmente trabalho com valores fixos por projeto ou hourly rate. Me conta mais sobre sua ideia!",
        prazo: "O prazo varia de acordo com o projeto. Landing pages levam de 1-2 semanas, aplicações mais complexas de 4-8 semanas. Sempre priorizo qualidade sobre velocidade.",
      };

      const lowerMessage = userMessage.toLowerCase();
      let response = "Obrigado pela mensagem! Para uma resposta mais detalhada, entre em contato diretamente pelo email josemendess004@gmail.com ou LinkedIn.";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    simulateResponse(content);
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
    <Section
      id="contact"
      ref={sectionRef}
      className="relative border-t border-border/20"
    >
      <Container className="md:px-30">
        <div className="flex flex-col gap-12 lg:gap-16">
          {/* Header */}
          <div ref={headlineRef}>
            <Eyebrow>05 / Contato</Eyebrow>
            <h2 className="mt-4 font-display text-5xl tracking-tight md:text-7xl lg:text-8xl">
              Vamos construir
              <br />
              algo juntos.
            </h2>
            <p className="mt-8 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
              Disponível para projetos freelance e oportunidades em empresas de
              tecnologia. Use o chat abaixo ou entre em contato diretamente.
            </p>
          </div>

          {/* Main Layout: Chatbot + Supplementary */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Chatbot Principal - Left Side */}
            <div ref={chatRef} className="flex-1 lg:max-w-[60%]">
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
            <div className="flex flex-col gap-6 lg:flex-1">
              {/* Quick Actions */}
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Perguntas Rápidas
                </p>
                <div
                  ref={cardsRef}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2"
                >
                  {quickPrompts.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleQuickPrompt(item.prompt)}
                      className="quick-card group rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-left font-mono text-xs transition-all hover:border-accent/50 hover:bg-card"
                    >
                      <span className="text-foreground group-hover:text-accent">
                        {item.label}
                      </span>
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
                    <ScrambleTextOnHover
                      text="WhatsApp"
                      as="span"
                      duration={0.7}
                    />
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
        </div>
      </Container>
    </Section>
  );
}
