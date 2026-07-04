"use client";

import { useLocale } from "@/i18n/context";
import { ActionLink } from "@/_components/ui/action-link";

type Props = Omit<
  React.ComponentPropsWithoutRef<typeof ActionLink>,
  "href"
>;

/**
 * Link "Voltar para home": navegação normal para a home do locale.
 *
 * Nunca usa router.back() — back() vai para a entrada ANTERIOR do
 * histórico, que só é a home quando o usuário veio direto dela (num fluxo
 * home → cases → case, "voltar para home" cairia na lista de cases).
 * A posição de scroll da home é restaurada pelo SmoothScroll, que salva
 * a posição por rota e restaura também em navegações push para a home.
 */
export function BackToHomeLink({ children, ...props }: Props) {
  const locale = useLocale();

  return (
    <ActionLink href={`/${locale}`} {...props}>
      {children}
    </ActionLink>
  );
}
