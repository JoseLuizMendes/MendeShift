/**
 * Origem de campanha (UTM) da visita.
 *
 * O visitante quase nunca envia o briefing na mesma URL em que chegou: ele
 * entra pela home com ?utm_source=... e navega até /contato, onde os
 * parâmetros já sumiram. Por isso a origem é guardada no sessionStorage no
 * primeiro carregamento e lida de lá no envio do formulário.
 */

export type Utm = { source?: string; medium?: string; campaign?: string };

const STORAGE_KEY = "mendeshift:utm";

function fromSearch(search: string): Utm | undefined {
  const params = new URLSearchParams(search);
  const utm: Utm = {
    source: params.get("utm_source")?.slice(0, 100) || undefined,
    medium: params.get("utm_medium")?.slice(0, 100) || undefined,
    campaign: params.get("utm_campaign")?.slice(0, 100) || undefined,
  };
  return utm.source || utm.medium || utm.campaign ? utm : undefined;
}

/** Guarda a UTM da URL atual, se houver. Chamado no carregamento da página. */
export function rememberUtm(): void {
  const utm = fromSearch(window.location.search);
  if (!utm) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // sessionStorage indisponível (modo privado restrito): segue sem guardar.
  }
}

/** UTM da URL atual ou, na falta dela, a guardada na chegada ao site. */
export function readUtm(): Utm | undefined {
  const current = fromSearch(window.location.search);
  if (current) return current;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Utm) : undefined;
  } catch {
    return undefined;
  }
}
