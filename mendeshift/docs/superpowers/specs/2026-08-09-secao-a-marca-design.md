# Design — Seção "A Marca" (refação do Colofão/Footer)

> Status: **design aprovado** (decisões travadas com o dono). Próximo passo: implementação
> (o dono escreve o código; a IA revisa depois). Nada aqui deve ser codado pela IA.
> Base: skill de design da Apple (Emil Kowalski) + `motion-design-engineering`.

## Contexto

A seção de fecho do site (hoje `ColophonSection`, eyebrow `07 / Colofão`, título **Créditos**)
vira um **fecho de marca** inspirado — **não copiado** — no footer do landonorris.com. O dono
não quer foto pessoal; no lugar entra a **identidade de marca** (wordmark + assinatura). O nome
"Créditos" sai ("créditos a quem?").

Referência do Lando (mapeada para um portfólio de software, não plagiada):

| Lando (piloto) | MendeShift (estúdio/dev) |
|---|---|
| Foto de capacete (âncora de identidade) | **Wordmark `MENDESHIFT` + assinatura da marca por cima** |
| Colunas PAGES / FOLLOW ON | **Sem colunas de navegação** (o SideNav já cobre) |
| Faixa de patrocinadores | **Marquee de stack/ferramentas** (prova de craft) — já existe |
| BUSINESS ENQUIRIES (botão) | **CTA primário "Iniciar projeto"** |
| © + Privacy/Terms | © + **Privacidade / Termos** (links placeholder) + voltar ao topo |
| Assinatura manuscrita do Lando (SVG) | **Assinatura real do dono**, desenhada à mão, limpa via potrace |

## Decisões travadas (todas aprovadas)

1. **Âncora** = wordmark `MENDESHIFT` gigante + **assinatura da marca** sobreposta.
2. **Assinatura** = a rubrica real do dono (um "M" com traço/rubrica), **não** o nome pessoal legível.
   Já capturada e limpa. Asset final: `public/signature.svg` (um único `<path>`, `currentColor`).
3. **Nome da seção**: eyebrow `07 / Marca`; título **"A Marca"** (EN **"The Brand"**).
4. **Composição**: wordmark full-bleed dominando → assinatura sobreposta → marquee de stack logo
   abaixo → linha com CTA primário + canais → rodapé legal simples.
5. **Colunas de navegação**: **fora** (o SideNav já resolve; mantém minimalismo).
6. **CTA**: botão **primário** "Iniciar projeto" / "Start a project" (destaque, estilo BUSINESS ENQUIRIES).
7. **Legal**: © {ano} + links **Privacidade** (`/privacidade`) e **Termos** (`/termos`) já presentes,
   apontando pra rotas-placeholder (páginas serão criadas depois). Mantém "voltar ao topo".
8. **Marquee**: continua (prova de craft); **sem separadores** (só palavras), hover→accent suave
   (já corrigido — sem gate `@media (hover:hover)`), pausa no hover.

## O asset de assinatura (`public/signature.svg`)

- **Origem**: o dono desenhou a assinatura no Excalidraw (freehand). O export trazia o "tremido"
  do traço à mão livre congelado no contorno preenchido.
- **Limpeza (pipeline, já executado)**: rasterizar em alta resolução → leve blur gaussiano
  (funde a micro-trepidação) → **potrace** com `optCurve`, `alphaMax 1.334`, `optTolerance 2.6`
  → contorno redesenhado em Béziers lisas. Resultado: mesmo gesto, traço com cara de tinta.
- **Formato final**: `<svg viewBox="0 0 1800 1681"><path d="…" fill="currentColor" fill-rule="evenodd"/></svg>`.
  Monocromático via `currentColor` (herda a cor do container — usar **accent**). Zero dependência,
  zero CLS, escalável.
- **Reprodutibilidade**: scripts do pipeline em `scratchpad/sig/` (`process2.js`) caso se queira
  re-suavizar. O SVG cru do dono está em `mendeshift/assinatura.svg` (pode ser removido do repo
  depois de conferir — não é usado em runtime).

## Composição (topo → base)

Ordem dentro da `<Section id="colophon">` (mantém o id p/ âncora estável do "voltar ao topo"):

1. **Header** (dentro de `Container`): `Eyebrow` `07 / Marca` + `SectionTitle` "A Marca" + `SectionLead`
   (reaproveita o lead atual: "Sistema visual, stack e decisões fundamentais por trás da interface.
   Este site é a demonstração viva do padrão de entrega do estúdio.").

2. **Brand anchor** (full-bleed, fora do `Container` — a peça central):
   - **Wordmark** `MENDESHIFT` em `font-display` (Bebas Neue), tamanho massivo responsivo
     `clamp(...)`, **tracking negativo** (`-0.02em`, regra Apple p/ display grande), **leading apertado**
     (`~0.9`), cor `foreground`. Full-bleed, dominante. Pode receber uma máscara de fade nas bordas
     p/ integrar (opcional, transform/opacity apenas).
   - **Assinatura** (`Signature`) sobreposta ao wordmark (posição estilo Lando — cruzando/no canto
     superior-direito do wordmark), cor **accent**, ~0.7–0.9× a altura do wordmark. Ajuste fino de
     posição/tamanho na verificação visual.

3. **Marquee** (full-bleed): as fileiras de stack existentes (`LogoLoop`), sem separadores, hover→accent,
   pausa no hover. Prova de craft logo abaixo da âncora.

4. **CTA + canais** (dentro de `Container`, linha slim): `Button variant="primary"` "Iniciar projeto"
   (`href="/contato"`) de um lado; do outro, os canais (email/GitHub/LinkedIn) como hoje
   (ghost buttons + scramble). Empilha no mobile.

5. **Rodapé legal** (dentro de `Container`, `border-t`, linha simples): `© {year} MendeShift` +
   links **Privacidade** e **Termos** (ghost, pequenos) + **voltar ao topo**. Sem card.

## Copy / i18n (`messages/{en,pt}.json` → namespace `colophon`)

**Alterar**:
- `eyebrow`: `07 / Brand` · `07 / Marca`
- `title`: `The Brand` · `A Marca`
- `lead`: manter o atual (ou encurtar levemente).

**Adicionar**:
- `cta_project`: `Start a project` · `Iniciar projeto`
- `privacy`: `Privacy` · `Privacidade`
- `terms`: `Terms` · `Termos`
- `signature_alt`: `MendeShift signature` · `Assinatura MendeShift` (aria-label do SVG)
- `wordmark_alt` (se o wordmark for imagem/aria): `MendeShift` (provavelmente texto real, dispensa).

**Manter**: `contact_label`, `copyright`, `back_to_top`.

**Remover (não usados)**: `build_notes`, `build_text`, `groups_count`, `system_count`,
`contact_text`, `year_label`.

## Motion & Design (Apple / Emil)

- **Tipografia (regra Apple)**: display grande = tracking **negativo** (`-0.02em`) + leading apertado;
  hierarquia por peso+tamanho, não só tamanho. Já é a linguagem do site.
- **Reveal**: header, brand anchor e rodapé entram com `opacity` + `y` sutil (GSAP `power3.out`,
  ScrollTrigger `top 90%`, `play none none none`) — padrão já existente na seção.
- **Assinatura (o "momento")**: como é um **contorno preenchido** (não traço único), a animação de
  "se desenhando" é feita por **máscara wipe** esquerda→direita (não `stroke-dashoffset`).
  `mask-image`/`clip-path` animando de 0→100% da largura quando entra na viewport, ~900ms `ease-out`,
  **uma vez**. GPU-friendly, sem layout.
- **CTA (feedback sub-300ms)**: press em `pointer-down` (`active:scale-[0.98]`), `focus-visible` ring —
  o `Button` primário já traz. Nada trava input.
- **Reduced-motion**: `@media (prefers-reduced-motion: reduce)` → assinatura aparece **estática**
  (sem wipe), reveals viram cross-fade curto ou nada; marquee estático (já é). Regra Apple: trocar
  slide/spring por cross-fade curto.
- **GPU only**: só `transform`/`opacity`/`mask`. Sem animar layout, cor de fundo, box-shadow em loop.

## SEO / Core Web Vitals (obrigatório — passa no Speed Insights)

- Wordmark = **texto real** (`<h2>`/`<p>` com `aria-hidden` se for decorativo, ou heading real) —
  não imagem. Preserva semântica e zero peso.
- Assinatura = SVG inline com `role="img"` + `aria-label` (i18n `signature_alt`). Decorativa mas rotulada.
- Marquee: a 2ª cópia continua `aria-hidden` (não duplica conteúdo pro leitor de tela).
- Links (contato, privacy, terms, CTA) = **âncoras reais** (`<a href>`) via `Button`/`localeHref`.
- **Zero dependência nova**, **zero CLS** (SVG com viewBox, wordmark é texto), animações não afetam
  layout nem custo de transição entre páginas.

## Arquivos a mexer (implementação)

- `public/signature.svg` — **já criado** (asset final).
- `src/_components/colophon-section.tsx` — reestruturar conforme "Composição": header, brand anchor
  (wordmark + `Signature`), marquee (mantém), linha CTA+canais, rodapé legal com Privacidade/Termos.
  Adicionar reveal do anchor ao `gsap.context`.
- `src/_components/ui/signature.tsx` — **novo** (client). Renderiza o SVG (inline ou via `<img>`/fetch)
  com o wipe reveal + IntersectionObserver/ScrollTrigger + reduced-motion. Props: `className`, `label`.
- `src/app/globals.css` — utilitário/keyframes do wipe da assinatura + gate reduced-motion.
- `messages/en.json` + `messages/pt.json` — chaves do namespace `colophon` (adicionar/alterar/remover).
- (Depois, fora deste escopo) páginas `/privacidade` e `/termos` — só criar quando existirem; os links
  já ficam apontando.

## Pendências herdadas (decidir no commit)

Há mudanças **não commitadas** da rodada anterior (Fase 3) sobre `3a4261d`:
`colophon-section.tsx`, `globals.css` (fix hover→accent + separador removido), `recent-writing-section.tsx`.
Elas convivem com esta refação. Recomendação: commitar essa base antes/junto da implementação de "A Marca".

## Verificação (quando o código existir)

1. `pnpm exec tsc --noEmit` + `pnpm build` + `pnpm lint` limpos; `pnpm test` (blog) verde.
2. Preview: wordmark full-bleed + assinatura em accent sobreposta; assinatura faz o **wipe uma vez**
   ao entrar na viewport; marquee sem separadores com hover→accent; CTA primário com press; rodapé
   com ©, Privacidade, Termos, voltar ao topo. **Sem caixas.**
3. Mobile (375px): sem overflow horizontal; assinatura/wordmark escalam; CTA com press.
4. `prefers-reduced-motion`: assinatura estática, sem wipe; marquee estático.
5. Grep: nenhuma string i18n removida ainda referenciada; links são `<a href>` reais.
