"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type QuestionItem = {
  question: string;
  answer: string;
  content?: ReactNode;
};

export function QuestionAccordion({ items, className }: {
  items: QuestionItem[];
  className?: string;
}) {
  const id = useId();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map(({ question, answer, content }, index) => {
        const isOpen = openQuestion === question;
        const panelId = `${id}-panel-${index}`;
        const preview = answer.length > 62 ? `${answer.slice(0, 62).trimEnd()}…` : answer;

        return (
          <div
            key={question}
            data-open={isOpen || undefined}
            className="group/question border border-border/50 bg-card/30 transition-colors interaction-motion hover:border-accent/35 hover:bg-card/50 data-open:border-accent/50 data-open:bg-card/60"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenQuestion(isOpen ? null : question)}
              className="flex min-h-12 w-full cursor-pointer items-start justify-between gap-3 px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex min-w-0 flex-col">
                <span className="font-mono text-sm font-medium text-foreground transition-colors interaction-motion group-data-open/question:text-accent sm:text-xs">
                  {question}
                </span>
                <span
                  aria-hidden="true"
                  className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] interaction-motion group-data-open/question:grid-rows-[0fr] group-data-open/question:opacity-0"
                >
                  <span className="min-h-0 overflow-hidden">
                    <span className="mt-1 line-clamp-2 font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-[10px]">{preview}</span>
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 text-accent"
              >
                <ChevronDown className="size-4 transition-transform interaction-motion group-data-open/question:rotate-180" />
              </span>
            </button>
            <div
              id={panelId}
              inert={!isOpen}
              aria-hidden={!isOpen}
              className="grid grid-rows-[0fr] transition-[grid-template-rows] interaction-motion group-data-open/question:grid-rows-[1fr]"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-2.5 border-t border-border/40 px-4 py-3.5 font-mono text-sm leading-relaxed text-foreground/90 sm:text-xs">
                  {content ?? <p>{answer}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
