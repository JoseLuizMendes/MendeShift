import { QuestionAccordion } from "./ui/question-accordion";

export type FaqItem = { q: string; a: string };

export function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <div>
      <h2 className="mb-8 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <QuestionAccordion items={items.map(({ q, a }) => ({ question: q, answer: a }))} />
    </div>
  );
}
