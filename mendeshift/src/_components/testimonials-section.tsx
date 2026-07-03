import { Card } from "@/_components/ui/card";
import { Container } from "@/_components/ui/container";
import { Eyebrow, Section, SectionTitle } from "@/_components/ui/section";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Depoimentos de clientes (Fase 2).
 *
 * Data-driven de propósito: enquanto `testimonials` estiver vazio a seção não
 * renderiza nada. Nunca lançar com depoimentos inventados — preencher apenas
 * com quotes reais de clientes, com autorização.
 */
const testimonials: Testimonial[] = [];

export function TestimonialsSection({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" className="relative">
      <Container className="md:px-30">
        <div className="mb-12 md:mb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle>{title}</SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.author} className="flex h-full flex-col gap-6 border-border/50 bg-card/60 p-6 sm:p-8">
              <p className="flex-1 font-mono text-sm leading-relaxed text-foreground/90">
                “{item.quote}”
              </p>
              <footer>
                <p className="font-mono text-xs font-medium text-foreground">{item.author}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.role}
                </p>
              </footer>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
