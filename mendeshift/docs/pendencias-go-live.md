# Pendências de Go-live — tracker

Arquivo de acompanhamento. **Marque `[x]`** conforme for concluindo cada item e anote
observações (datas, valores que o Google/Vercel te derem) nas linhas `> Nota:`.

Visão geral rápida está em [go-live-dominio-seo.md](go-live-dominio-seo.md). **Este arquivo é o
passo a passo detalhado, explicando cada clique** — pensado pra quem nunca mexeu com DNS/Vercel.

Legenda de quem faz: 🧑 = você · 🤖 = Claude (código).

---

## 0. Pendência técnica (🤖 — já pronta, falta só commitar)

- [ ] Commitar as 3 mudanças de código (`metadata.ts` via env var, `README.md`, docs novos).
  > Nota: peça ao Claude "commite as mudanças" ou faça você: `git add -A && git commit`.

---

## 1. Registrar o domínio (🧑 — pago, ~R$ 40/ano)

- [ ] Criar/entrar na conta em [registro.br](https://registro.br) (login gov.br, com CPF — **CNPJ não é obrigatório**).
- [ ] Pesquisar `mendeshift.com.br` e confirmar que está disponível.
- [ ] Concluir o pagamento (Pix/boleto/cartão).
  > Nota (data de compra / validade): ____________________

---

## 2. Conectar o domínio à Vercel (🧑 — grátis)

> **O que é isto:** dizer ao registro.br "quando alguém digitar mendeshift.com.br, mande para os
> servidores da Vercel". Isso se faz criando **registros DNS**. Um registro DNS é uma linha com
> 4 campos: **Tipo** (A, CNAME, TXT...), **Nome/Host** (qual subdomínio), **Valor/Dados** (para
> onde aponta) e **TTL** (tempo de cache — pode deixar o padrão).

### 2.1 Pegar os registros na Vercel

- [ ] Entrar em [vercel.com](https://vercel.com) na conta que tem o projeto **mendeshift**.
- [ ] Abrir o projeto → aba **Settings** (topo) → item **Domains** (menu lateral).
- [ ] Campo "Add Domain" → digitar `mendeshift.com.br` → **Add**.
- [ ] Repetir e adicionar também `www.mendeshift.com.br`. Se a Vercel perguntar sobre redirect,
      escolha **redirecionar `www` → `mendeshift.com.br`**.
- [ ] A Vercel vai mostrar os registros a criar. **Anote exatamente o que ela mostrar** — o padrão é:
  - Apex `mendeshift.com.br` → **Tipo A**, Valor = o IP que a Vercel exibir (hoje costuma ser `76.76.21.21`).
  - `www` → **Tipo CNAME**, Valor = `cname.vercel-dns.com`.
  > Nota (valores que a Vercel mostrou): A = __________ · CNAME = __________

### 2.2 Criar os registros no registro.br

- [ ] No [registro.br](https://registro.br), abra o domínio → **Editar Zona / DNS** (painel de DNS).
- [ ] Adicionar o registro **A** do apex:
  - Campo **Nome/Host:** deixe **em branco** (branco = o próprio domínio, o "@").
  - **Tipo:** `A`
  - **Valor/Dados:** o IP da Vercel (ex.: `76.76.21.21`).
- [ ] Adicionar o registro **CNAME** do www:
  - **Nome/Host:** `www`
  - **Tipo:** `CNAME`
  - **Valor/Dados:** `cname.vercel-dns.com` (se o painel exigir ponto final, use `cname.vercel-dns.com.`).
- [ ] **Salvar** a zona.
  > ⚠️ Não apague registros que já existirem sem saber o que são. Só **adicione** os novos.

### 2.3 Confirmar

- [ ] Voltar na Vercel → Settings → Domains. Aguardar o status virar **"Valid Configuration"**
      (pode levar de alguns minutos a poucas horas — é a "propagação de DNS").
- [ ] Deixar `mendeshift.com.br` marcado como **Primary Domain**.
- [ ] Abrir `https://mendeshift.com.br` no navegador e ver o site com **cadeado** (HTTPS).
  > Nota (data em que ficou no ar): ____________________

---

## 3. Apontar o site para o domínio novo — `NEXT_PUBLIC_SITE_URL` (🧑 — grátis)

> **Por que:** neste ponto o site já abre no domínio, mas os endereços que o Google lê
> (canonical, sitemap) ainda apontam para o `.vercel.app`. Esta variável corrige isso. O código
> já está pronto para lê-la; você só precisa defini-la na Vercel.

- [ ] Vercel → projeto → **Settings → Environment Variables**.
- [ ] **Add New**:
  - **Key (nome):** `NEXT_PUBLIC_SITE_URL`
  - **Value (valor):** `https://mendeshift.com.br`  *(sem barra `/` no final)*
  - **Environments:** marque **Production** (pode marcar Preview também).
  - **Save**.
- [ ] **Redeploy obrigatório** (a variável só "entra" num build novo):
  - Aba **Deployments** → no deploy mais recente, clique no menu **⋯** → **Redeploy** → confirme.
- [ ] Conferir que funcionou: abra `https://mendeshift.com.br/pt/servicos`, clique com o botão
      direito → **Exibir código-fonte** (view-source) e procure (`Ctrl+F`) por `canonical`.
      Deve aparecer: `<link rel="canonical" href="https://mendeshift.com.br/pt/servicos">`.
- [ ] Abrir `https://mendeshift.com.br/sitemap.xml` e ver as URLs no domínio novo.
  > Nota (data do redeploy): ____________________

---

## 4. Google Search Console — verificação por DNS TXT (🧑 — grátis)

> **O que é:** provar ao Google que o domínio é seu, criando **mais um registro DNS** (tipo TXT).
> Escolhemos o tipo "Domínio" porque cobre o site inteiro (com e sem www, todos os subdomínios).

- [ ] Entrar em [search.google.com/search-console](https://search.google.com/search-console) com
      a conta Google que você vai usar para o site.
- [ ] **Adicionar propriedade** → coluna da **esquerda: "Domínio"** → digitar `mendeshift.com.br` → **Continuar**.
- [ ] O Google mostra um valor tipo `google-site-verification=xxxxxxxxxxxxxxxx`. **Copie.**
- [ ] No registro.br → **Editar Zona / DNS**, adicione:
  - **Nome/Host:** em branco (`@`, o domínio raiz)
  - **Tipo:** `TXT`
  - **Valor/Dados:** cole o `google-site-verification=...` (se o painel pedir aspas, coloque entre `"`).
  - **Salvar.**
  > Nota (valor do TXT): ____________________
- [ ] Espere alguns minutos e clique **Verificar** no Search Console.
- [ ] Verificado ✅ → menu **Sitemaps** → em "Adicionar novo sitemap" digite `sitemap.xml` → **Enviar**.
  > Nota (data verificado): ____________________

---

## 5. Google Business Profile (🧑 — grátis)

> Faz o site aparecer nas buscas locais ("criação de sites em Vitória ES") e no Google Maps.

- [ ] Entrar em [business.google.com](https://business.google.com) → **Adicionar empresa**.
- [ ] **Nome:** `MendeShift — Estúdio Digital`.
- [ ] **Categoria principal:** *Web designer* (adicione depois secundárias: *Agência de marketing*, *Serviço de software*).
- [ ] Quando perguntar do endereço: escolher **"Atendo clientes fora do meu endereço / empresa de
      área de atendimento"** (não expõe endereço residencial) → definir **Vitória, ES** e região
      (Vila Velha, Serra, Cariacica).
- [ ] **Telefone/WhatsApp:** `+55 27 99630-0333` · **Site:** `https://mendeshift.com.br`.
- [ ] Fazer a **verificação** que o Google oferecer (vídeo, ligação ou cartão). Sem verificar, não aparece.
  > Nota (método / data): ____________________
- [ ] Depois de verificado: escrever descrição, adicionar os 4 serviços, fotos de trabalhos, horário.

---

## Checklist final (quando tudo acima estiver ✅)

- [ ] `https://mendeshift.com.br` abre com HTTPS válido.
- [ ] `www` redireciona para o apex.
- [ ] Canonical/sitemap no domínio novo (passo 3 conferido).
- [ ] Search Console verificado + sitemap enviado.
- [ ] Business Profile verificado.
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) numa página de `/servicos` sem erros.
- [ ] Preview do link no WhatsApp mostra a imagem OG da agência.
