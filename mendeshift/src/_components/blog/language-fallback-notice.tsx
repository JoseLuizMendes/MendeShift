/**
 * Aviso discreto exibido quando um post é servido num idioma diferente do
 * pedido (o outro idioma ainda não foi traduzido). A rede de segurança que
 * evita travar a publicação por falta de tradução.
 */
export function LanguageFallbackNotice({ message }: { message: string }) {
  return (
    <p
      role="note"
      className="mb-8 rounded-[var(--radius)] border border-accent/30 bg-accent/5 px-4 py-3 font-mono text-[11px] leading-relaxed tracking-wide text-muted-foreground"
    >
      {message}
    </p>
  );
}
