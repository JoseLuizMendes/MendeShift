# Design — Seção "A Marca" (fecho do site, inspirado no footer do landonorris.com)

> Status: **implementado**. Base: skill de design da Apple (Emil Kowalski) + `motion-design-engineering`.
> Substitui a versão anterior desta spec (que previa uma *assinatura* como âncora — descartada).

## Contexto

O `ColophonSection` (eyebrow `07 / Marca`, título **A Marca**) vira um **fecho de marca**
inspirado — **não copiado** — no footer do landonorris.com: fundo escuro, painel com cantos
"não 100% quadrados" (moldura entalhada), composição com wordmark + imagem central + colunas
laterais + marquee + CTA + rodapé legal. **Sem** o verde/lime do Lando (mantém a paleta do site).

Mapa das anotações do dono sobre o print de referência:

| Lando | MendeShift |
|---|---|
| STORE + hambúrguer (topo-dir.) | **removidos** (o `SideNav` já cobre navegação) |
| Assinatura manuscrita sobre a frase | **descartada** (não passava autoridade) |
| Foto de capacete (centro) | **retrato editorial do fundador** (cutout) |
| Coluna PAGES | coluna **"Páginas"** (rotas reais) |
| Coluna FOLLOW ON | coluna **"Seguir"** — só TikTok, Instagram, LinkedIn |
| "ALWAYS BRINGING THE FIGHT" | **frase-manifesto** do estúdio |

## Decisões travadas

1. **Paleta:** a atual do site — near-black + **coral** (`--accent:#ff4d4f`). Só a estrutura vem do Lando.
2. **Âncora = o fundador** (footer pessoal), com nome "José Luiz Mendes" + frase-manifesto.
3. **Imagem central = retrato editorial** do fundador, **cutout com fundo transparente** (o fundo é a
   moldura). Luz frontal, tratamento coral. Gerado no Google Flow / Nano Banana Pro a partir de fotos
   reais (edit/img2img) para preservar 100% a identidade — o coral vem do **site**, não de luz atrás.
4. **Moldura entalhada:** cantos arredondados grandes + **berço côncavo** na borda inferior (cradle do CTA)
   + borda coral que **se desenha** ao entrar na viewport + textura **blueprint** sutil ao fundo.
5. **Colunas:** "Páginas" (esq.) + "Seguir" (dir.) flanqueando a âncora.

## Composição (dentro de `<Section id="colophon">`, num painel `NotchedFrame`)

1. **Topo:** wordmark pequeno `MENDESHIFT` (esq.) + contato direto **Email · GitHub** (dir., ghost + scramble).
2. **Header:** `Eyebrow 07 / Marca` + `SectionTitle A Marca` + `SectionLead`.
3. **Âncora central** (grid `[Páginas] [centro] [Seguir]` no desktop; empilha no mobile):
   - **Frase-manifesto** (`font-display`, duas cores): PT "Quem desenha" + **"é quem constrói."** (accent).
   - **Retrato** (`next/image`, 4:5, `object-top`, `.portrait-fade` na base) sobreposto pela frase.
   - **Caption**: `José Luiz Mendes · Fundador` (accent no cargo).
4. **CTA** `Iniciar projeto` (`variant="primary"`, `href="/contato"`) encaixado no **berço inferior**.
5. **Marquee** de stack (`LogoLoop`, 4 fileiras) — mantido.
6. **Rodapé legal:** `© {ano} MendeShift` + Privacidade + Termos + voltar ao topo.

## A moldura (`src/_components/ui/notched-frame.tsx`)

- Contorno = **SVG medido em pixels reais** (`getBoundingClientRect` síncrono no mount + `ResizeObserver`
  para resize). Medir por RO sozinho não bastava: sem compositing (aba oculta) o RO não entrega — o
  `getBoundingClientRect` resolve e ainda evita flash.
- `buildPanelPath`: retângulo de cantos `r` + **berço elíptico** único na base (`A rx ry 0 0 0 …`,
  sweep 0 → mergulha para dentro; `rx` = meia-largura, `ry` = profundidade do notch). Simples e à prova
  de curvatura errada.
- Camadas do SVG: `path` fill (`--background`) → grid **blueprint** (`<pattern>` + 2 quadrados accent,
  recortados pelo contorno via `clipPath`, ~6–10% de opacidade) → `path` stroke coral com
  `.notch-frame__stroke` (dash animado). Decorativo: `aria-hidden`.
- **Draw-on** (globals.css `.notch-frame__stroke`): `stroke-dashoffset` de `--dash`→0 em 1200ms quando o
  `IntersectionObserver` (observando o root) dispara. Reduced-motion → estático completo.

## Copy / i18n (`messages/{en,pt}.json` → `colophon`)

- **Adicionadas:** `manifesto_a`, `manifesto_b`, `pages_label`, `follow_label`, `founder_role`, `portrait_alt`.
- **Removidas:** `signature_alt`, `contact_label`.
- **Mantidas:** `eyebrow`, `title`, `lead`, `cta_project`, `privacy`, `terms`, `copyright`, `back_to_top`.
- Coluna "Páginas" reaproveita labels do namespace `nav`; "Seguir" usa nomes próprios.

## Assets

- `public/founder.webp` — retrato (placeholder atual = foto real; **trocar** pelo cutout transparente
  tratado quando pronto, mesmo caminho → drop-in).
- `public/signature.svg` — **removido** (assinatura descartada). `.signature-wipe` removido do CSS.

## Motion / SEO / CWV

- Só `transform`/`opacity`/`mask`/`stroke-dashoffset` (GPU). Reveals via GSAP ScrollTrigger (`top 90%`,
  `play none none none`), padrão da seção.
- Retrato via `next/image` (dims reservadas por `aspect-[4/5]` → zero CLS), `lazy` (abaixo da dobra).
- Frase, nome, wordmark = texto real; colunas/legal = âncoras reais (`Button` → `localeHref`).
- Zero dependência nova.

## Pendências do dono

- [ ] Trocar `public/founder.webp` pelo **cutout transparente** tratado (luz frontal + grade coral no pós).
- [ ] Confirmar a **frase-manifesto** (atual: "Quem desenha / é quem constrói.").
- [ ] Confirmar **handles de TikTok e Instagram** (hoje placeholders em `colophon-section.tsx`;
  LinkedIn já correto).

## Rodada 2 — fidelidade ao Lando (feita)

- **Moldura:** além do berço inferior, agora tem **entalhe côncavo no topo-centro** (`topDipWidth/Depth`
  em `NotchedFrame`; arco elíptico sweep 0 mergulhando p/ baixo — verificado: dip até y=24).
- **Colunas** Páginas/Seguir em **`font-display` grande** (Bebas Neue, ~30px), como no Lando.
- **Marquee + rodapé legal movidos para DENTRO do painel.** Rodapé = `©` à esquerda, Privacidade/Termos/
  voltar-ao-topo à direita (mesma linha). CTA fica no **berço central** entre eles.
- **Bug de qualidade corrigido:** `sizes` do retrato estava `"70px"` (servia imagem minúscula esticada);
  agora `320/360px` → nítido.
- **Sem wordmark** grande no topo (só Email/GitHub) — decisão do dono.
- **Imagem:** guia entregue — asset deve ter **fundo `#0b0c0f` sólido** (não recortar p/ transparente),
  ≥1200×1500, WebP; resolve o cabelo esquisito do recorte.

## Rodada 3 — enquadramento e "uma tela só" (feita)

Feedback do dono: *"o meu precisa dar scroll pra aparecer tudo, o dele cabe na mesma tela;
tem que aproximar do sidebar à esquerda e da borda à direita, com o mesmo espaçamento do Lando."*

1. **Forma:** o path do React Bits ocupa só parte do viewBox (bbox `x 300→770` de `278→792`;
   `y 279.95→630.05` de `258→652`). Com `inset-0` isso jogava a borda ~4,7% para dentro na horizontal
   e ~6,3% na vertical — **margens fantasma**. O SVG passou a usar **insets negativos**
   (`-4.681%` / `-6.270%`), de modo que a **borda desenhada** coincide com a caixa do painel.
   `NotchedFrame` ganhou `className` (caixa externa) + `contentClassName` (conteúdo).
2. **Enquadramento full-bleed:** saiu o `Container` (o `xl:px-30` dele sobrevivia ao override e
   deixava 120px de cada lado). Agora `px-4 md:pl-[calc(4rem+1.25rem)] md:pr-5` →
   **20px de folga depois do SideNav (64px) e 20px da borda direita** — simétrico, como no Lando.
3. **Bug global de layout:** `body { overflow-x: hidden }` fazia o `overflow-y` computar `auto`,
   transformando o body em **segundo container de scroll** com barra própria comendo ~15px à direita
   de todo o site (era essa a assimetria residual). Trocado por `overflow-x: clip` (não cria scroll
   container); `max-width: 100vw` removido (100vw inclui a scrollbar).
4. **Uma tela só:** `Section` com `py-6` em todos os breakpoints e painel
   `md:h-[calc(100svh-3rem)]` → a seção mede **exatamente 100svh**. O conteúdo é um
   `flex flex-col` em que o miolo (`flex-1`) absorve a sobra, e o retrato tem **altura flexível**
   (`lg:flex-1` + `object-contain`) — encolhe em telas baixas em vez de estourar. Mobile mantém
   altura natural (`aspect-4/5`, rola).
5. **Composição:** título "A Marca" + lead compactados e movidos para a **mesma linha** dos
   contatos Email/GitHub (topo, `justify-between`), liberando altura. Manifesto maior com
   **duas linhas garantidas** via `max-w-[8em]` (medida em `em`, escala com o `clamp` da fonte).
6. **CTA:** centralizado exatamente na aba inferior (`top-full` agora coincide com a ponta da aba).

## Rodada 4 — forma inteira na tela + composição do Lando (feita)

1. **Bug: a forma estourava a caixa.** `<svg>` é elemento *substituído* — com `height:auto` ele
   dimensiona pela **proporção intrínseca do viewBox** em vez de resolver a altura por `top`+`bottom`.
   Resultado: a forma tinha 985px numa janela de 774 (topo cortado 273px acima da viewport).
   Corrigido com `width`/`height` explícitos (`109.362%` / `112.540%`) + `top`/`left` negativos.
   Medido: desvio **0px** nos quatro lados entre a bbox do path e a caixa do painel.
2. **Contraste do painel:** no Lando a silhueta é lida porque é verde-escuro sobre lime. Aqui o fill
   passou de `var(--background)` para `color-mix(in oklab, var(--background) 96%, var(--foreground))`
   — 4% de lift, dentro da paleta. Reverter = voltar o fill para `var(--background)`.
3. **Composição espelhando o Lando** (o conteúdo virou uma pilha `order-*` com o retrato fora do grid):
   - **Retrato** `lg:absolute` de `top-[40%]` até `bottom-0`, largura total, `object-contain object-bottom`,
     `z-0` — encosta na borda inferior e passa **atrás** das colunas, da stack e do rodapé, como o
     capacete. No mobile volta ao fluxo (`order-3`, logo abaixo do manifesto).
   - **Assinatura** (`José Luiz Mendes · Fundador`) subiu para **cima** do manifesto — o lugar do
     autógrafo do Lando (antes caía sobre o rosto).
   - **Manifesto** saiu do grid e atravessa o painel inteiro, centralizado.
   - **Colunas** Páginas/Seguir com `lg:col-start-1` / `lg:col-start-3` e `lg:items-end` — mesma
     linha de base, flanqueando o retrato.
   - **Stack** com `md:justify-between` de ponta a ponta (o marquee de patrocinadores).

## Rodada 5 — alinhamento aos degraus da forma (feita)

1. **Cabeçalho colado nos degraus:** padding do painel `md:px-14 → md:px-10` e `pt` para `3.75rem`,
   levando "A Marca"+lead **para baixo e para a esquerda** e Email/GitHub **para a direita**,
   encostando nos degraus da aba superior.
2. **Bug do título:** o override `md:text-3xl` não vencia o `sm:text-5xl`/`lg:text-7xl` do
   `SectionTitle` (variantes diferentes não conflitam no twMerge) — o título renderizava em **72px**.
   Agora todos os breakpoints vêm explícitos (`text-2xl sm:text-3xl md:text-3xl lg:text-4xl`).
3. **Colunas como no Lando:** `lg:items-end → lg:items-start`, com os rótulos PÁGINAS e SEGUIR
   na **mesma linha** (com listas de tamanhos diferentes, `items-end` desencontrava os dois).
4. **Rodapé legal fora do painel:** © / Privacidade / Termos saíram do `NotchedFrame` e ocupam o
   **vão entre a forma e o fim da seção**, ladeando a aba inferior que mergulha no centro (onde fica
   o CTA) — exatamente o arranjo do Lando. Como o rodapé agora soma altura, a **trava de uma tela
   migrou do painel para o wrapper** (`md:flex md:h-[calc(100svh-4.5rem)] md:flex-col` + painel
   `md:flex-1 md:min-h-0`), senão a seção passava de 100svh.
5. **Ícones da stack atrás do retrato:** fileira em `z-0` e retrato em `z-[1]`.
6. **Stack completa:** de 4 para **10 itens** conforme o `package.json` — Next.js, React, TypeScript,
   Tailwind e Vercel como marcas desenhadas; GSAP, Lenis, MDX, Zod e Resend como wordmark em mono
   (a maioria dos logos do Lando também é wordmark).

## Rodada 6 — rodapé invisível, colunas para dentro, stack em loop (feita)

1. **Bug: o rodapé legal sumia.** Cada bloco disparava seu próprio `ScrollTrigger` com
   `start: "top 90%"`. Como a seção passou a ocupar 100svh e é a **última da página**, o rodapé
   colado na base fica a ~95% da viewport — **nunca cruza os 90%**, então o `gsap.from` ficava
   preso em `opacity: 0`. Agora os três blocos entram num único tween com `stagger`, e o
   **gatilho é a seção** (`start: "top 75%"`), que sempre é cruzada na descida.
2. **Colunas para dentro:** `lg:px-[11%]` no grid — Páginas e Seguir saem de 40px de inset para
   **177px**, deixando de encostar nas bordas e aproximando-se do retrato, como no Lando.
3. **Stack em loop infinito:** a fileira virou o `LogoLoop` que **já existia no repo**
   (`ui/logo-loop.tsx`, CSS puro, dois conjuntos + `translateX(-50%)`, pausa no hover, estática em
   reduced-motion). Nada instalado — o `@react-bits/LogoLoop` pedido já tinha equivalente local.
   Nova chave i18n `colophon.stack_label` (`aria-label` da fileira).

> Nota de verificação: o painel do navegador do agente **não executa `rAF`** (não compõe frames),
> então GSAP e Lenis ficam parados nele. Os reveals foram conferidos forçando o estado final via
> DOM; a animação em si só dá para validar no navegador real.

## Verificação (feita)

- `tsc --noEmit` ✅ · `eslint` (arquivos alterados) ✅ · `vitest run` ✅ (22/22).
- Dev server: painel renderiza; berço côncavo centralizado (`A 120,46 … sweep 0`), CTA centralizado no
  berço; sem overflow horizontal em 1280 e 375; blueprint + borda coral presentes.
- Pendente de olho humano (o pane headless não compõe frames p/ screenshot): ver o **draw-on** da borda,
  o lazy-load do retrato e o visual final quando o cutout entrar.
