# Go-live: domínio próprio + Search Console + Google Business

Playbook das 3 ações de negócio que faltam para o site sair de `mendeshift.vercel.app`
e ganhar presença de busca. São passos **externos** (registrador, Vercel, Google) — o
código já está preparado: `SITE_URL` lê de `NEXT_PUBLIC_SITE_URL`
([src/lib/metadata.ts](../src/lib/metadata.ts)) e alimenta canonicals, `sitemap.xml`,
`robots.txt`, `og:url` e o JSON-LD.

Faça na ordem: **1 → 2 → 3 → 4 → 5**. Os passos 4 e 5 dependem do domínio já registrado (passo 1).

---

## 1. Registrar o domínio

**Recomendação:** `mendeshift.com.br` pelo **[registro.br](https://registro.br)** (registrador
oficial do `.br`). Vantagens: ~R$ 40/ano, `.com.br` sinaliza empresa brasileira (confiança +
leve reforço de SEO local em Vitória/ES), painel de DNS próprio. Exige CPF ou CNPJ.

> Alternativa `.com` global (Cloudflare Registrar / Namecheap) se quiser marca internacional.
> O resto do guia é idêntico — só muda onde você edita o DNS.

Passos no registro.br:
1. Pesquise `mendeshift.com.br` e confirme que está livre.
2. Faça login com a conta gov.br / CPF e conclua a compra.
3. Deixe a aba **DNS** do domínio aberta — você vai voltar nela nos passos 2 e 4.

---

## 2. Conectar o domínio à Vercel

1. Vercel → projeto **mendeshift** → **Settings → Domains → Add Domain**.
2. Adicione **os dois**: `mendeshift.com.br` (apex) e `www.mendeshift.com.br`. A Vercel
   sugere um redirect — escolha `www` → apex (ou o inverso; só seja consistente).
3. A Vercel mostra os **registros DNS exatos** a criar. Normalmente:
   - **apex** (`mendeshift.com.br`): registro **A** → o IP que a Vercel exibir
     (atualmente `76.76.21.21` — mas use sempre o valor do painel, ele é a fonte da verdade).
   - **www**: registro **CNAME** → `cname.vercel-dns.com`.
4. No painel de **DNS do registro.br**, crie exatamente esses registros.
5. Volte na Vercel e aguarde o status virar **Valid Configuration** (propagação: minutos a
   algumas horas). Deixe `mendeshift.com.br` como **Primary Domain**.

Neste ponto o site já abre no domínio novo — mas os canonicals ainda apontam para o
`.vercel.app` (fallback). Corrija no passo 3.

---

## 3. Apontar o site para o novo domínio (`NEXT_PUBLIC_SITE_URL`)

1. Vercel → **Settings → Environment Variables → Add**:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://mendeshift.com.br` (sem barra no final)
   - **Environments:** Production (marque Preview também se quiser previews com o domínio real).
2. **Redeploy** (Deployments → menu do último deploy → Redeploy). É obrigatório: variáveis
   `NEXT_PUBLIC_*` são "assadas" no build, não lidas em runtime.
3. Verifique no HTML publicado (view-source de `https://mendeshift.com.br/pt/servicos`):
   - `<link rel="canonical" href="https://mendeshift.com.br/pt/servicos">`
   - `https://mendeshift.com.br/sitemap.xml` lista as URLs no domínio novo.

Nenhum commit é necessário — trocar de domínio de novo no futuro é só editar esta variável e redeployar.

---

## 4. Google Search Console (verificação por DNS TXT)

Usamos propriedade do tipo **Domínio** (via DNS): cobre `http`/`https`, apex e todos os
subdomínios de uma vez, e não some se um deploy mudar o HTML.

1. [search.google.com/search-console](https://search.google.com/search-console) →
   **Adicionar propriedade → Domínio** → digite `mendeshift.com.br`.
2. O Google mostra um registro **TXT** tipo `google-site-verification=xxxxxxxx`.
3. No **DNS do registro.br**, crie um registro **TXT** no host raiz (`@`) com esse valor.
4. Volte no Search Console e clique **Verificar** (pode levar alguns minutos após salvar o DNS).
5. Verificado → **Sitemaps** → envie `sitemap.xml` (o Console preenche o domínio; basta o caminho).
6. Opcional: peça indexação das páginas-chave (`/`, `/pt`, `/servicos`, `/pt/servicos`,
   `/contato`, `/projetos`) pela **Inspeção de URL**.

---

## 5. Google Business Profile

Maior alavanca de SEO **local** ("criação de sites em Vitória ES", "agência de sites Vitória").

1. [business.google.com](https://business.google.com) → **Adicionar empresa**.
2. **Nome:** `MendeShift — Estúdio Digital`.
3. **Categoria principal:** *Web designer* (ou *Serviço de design de sites*). Adicione
   secundárias: *Agência de marketing*, *Serviço de software*.
4. **Local:** como não há loja física para clientes, marque **"Atendo clientes fora do meu
   endereço"** (empresa de área de atendimento) e defina **Vitória, ES** e região metropolitana
   (Vila Velha, Serra, Cariacica). Não exponha endereço residencial.
5. **Contato:** telefone/WhatsApp `+55 27 99630-0333`, site `https://mendeshift.com.br`.
6. **Verificação:** siga o método oferecido (vídeo, ligação ou cartão postal). Sem verificar,
   o perfil não aparece na busca.
7. Depois de verificado: descrição, serviços (espelhando os 4 de `/servicos`), fotos de
   trabalhos, horário de atendimento. Peça avaliações a clientes reais assim que houver.

---

## Checklist pós-migração

- [ ] `https://mendeshift.com.br` abre e serve o site (HTTPS válido, cadeado).
- [ ] `www` redireciona para o apex (ou vice-versa).
- [ ] `NEXT_PUBLIC_SITE_URL` setada + redeploy feito.
- [ ] Canonical/hreflang/og:url de `/pt/servicos` apontam para `mendeshift.com.br`.
- [ ] `https://mendeshift.com.br/sitemap.xml` e `/robots.txt` no domínio novo.
- [ ] Search Console: propriedade de Domínio verificada + sitemap enviado.
- [ ] Google Business Profile criado e verificado.
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) nas URLs de `/servicos`
      e de um case (JSON-LD válido).
- [ ] Preview do link no WhatsApp/LinkedIn mostra a OG image de agência.
