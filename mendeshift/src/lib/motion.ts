/**
 * Preferência de movimento reduzido (acessibilidade / aparelhos fracos).
 *
 * O CSS já cobre as animações declarativas via @media em globals.css;
 * este helper cobre o que roda em JS (GSAP, Lenis, intervals de flip).
 * Componentes devem checar no início do efeito e pular a animação,
 * deixando o conteúdo no estado final estático.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
