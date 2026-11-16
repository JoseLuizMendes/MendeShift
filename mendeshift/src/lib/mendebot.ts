/**
 * MendeBot — serviço adicional do estúdio (bots sob medida), publicado em
 * site próprio. Fonte única do endereço: /servicos, home, rodapé, llms.txt
 * e o prompt do chat leem daqui.
 *
 * `NEXT_PUBLIC_MENDEBOT_URL` troca o endereço quando houver domínio próprio.
 */
export const MENDEBOT_URL = (
  process.env.NEXT_PUBLIC_MENDEBOT_URL ??
  "https://mendebot-frontend-421944910318.us-central1.run.app"
).replace(/\/$/, "");

/** Link de saída com UTM, para identificar a origem da visita no MendeBot. */
export const MENDEBOT_HREF = `${MENDEBOT_URL}/?utm_source=mendeshift&utm_medium=referral`;
