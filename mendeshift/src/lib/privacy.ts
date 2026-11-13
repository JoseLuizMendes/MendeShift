/**
 * Conteúdo da Política de Privacidade (/privacidade), por locale.
 *
 * Fica em TS, fora de messages/*.json, porque é texto longo usado por uma
 * única página de servidor — no JSON ele iria para o bundle do cliente.
 *
 * IMPORTANTE: cada item descreve um fluxo real do código. Ao mudar a coleta
 * (novo campo no formulário, novo fornecedor, novo evento de analytics),
 * atualize este arquivo e a data em `updatedAt`.
 *   - Formulário: src/lib/leads.ts + src/app/api/lead/route.ts (Resend)
 *   - Chat: src/app/api/chat/route.ts (Gemini) + src/lib/chat-lead.ts
 *   - Rate limit por IP: src/lib/rate-limit.ts (Upstash)
 *   - Analytics: @vercel/analytics e @vercel/speed-insights (sem cookies)
 */

export const PRIVACY_CONTACT_EMAIL = "josemendess004@gmail.com";

type Block = { heading: string; paragraphs?: string[]; items?: string[] };

export type PrivacyContent = {
  eyebrow: string;
  title: string;
  lead: string;
  updatedLabel: string;
  updatedAt: string;
  blocks: Block[];
  contactLabel: string;
};

const pt: PrivacyContent = {
  eyebrow: "Legal / Privacidade",
  title: "Política de Privacidade",
  lead: "Quais dados este site coleta, para que servem, com quem são compartilhados e como você pede acesso ou exclusão.",
  updatedLabel: "Última atualização",
  updatedAt: "13 de novembro de 2026",
  blocks: [
    {
      heading: "Quem é o responsável",
      paragraphs: [
        "O MendeShift é o estúdio digital de José Luiz Mendes, em Vitória, ES. Ele é o controlador dos dados pessoais tratados por este site, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
      ],
    },
    {
      heading: "Dados que você envia",
      items: [
        "Formulário de briefing: nome, e-mail, WhatsApp e empresa (os dois últimos opcionais), tipo de serviço, faixa de investimento, prazo desejado e a descrição do projeto. O envio também registra o idioma da página e, se houver, a campanha de origem do acesso (parâmetros UTM).",
        "Assistente virtual: as mensagens que você escreve no chat. Se você informar nome e um contato durante a conversa, esses dados são encaminhados ao estúdio para retorno.",
        "Contato direto: o que você enviar por WhatsApp, e-mail ou redes sociais é tratado nessas plataformas, sob as políticas de cada uma.",
      ],
    },
    {
      heading: "Dados coletados automaticamente",
      items: [
        "Endereço IP: usado por até 24 horas para limitar envios repetidos do formulário e do chat e evitar abuso. Não é associado ao seu nome.",
        "Métricas de uso e desempenho: páginas visitadas, origem do acesso, tipo de dispositivo e tempo de carregamento, coletados de forma agregada pelo Vercel Web Analytics e pelo Speed Insights. Essas ferramentas não usam cookies nem identificam visitantes individualmente.",
        "Preferências no navegador: um cookie guarda o idioma escolhido, e o armazenamento de sessão guarda a posição de rolagem e a campanha de origem. Não há cookies de publicidade nem de rastreamento entre sites.",
      ],
    },
    {
      heading: "Para que os dados são usados",
      items: [
        "Responder ao seu pedido e preparar uma proposta, a seu pedido, antes de um eventual contrato (art. 7º, V, da LGPD).",
        "Proteger o site contra spam e abuso e entender, de forma agregada, quais páginas funcionam, com base no legítimo interesse do estúdio (art. 7º, IX).",
      ],
      paragraphs: [
        "Seus dados não são vendidos nem usados para enviar publicidade de terceiros.",
      ],
    },
    {
      heading: "Com quem os dados são compartilhados",
      paragraphs: [
        "O site depende de fornecedores que processam dados em nome do estúdio. Alguns mantêm servidores fora do Brasil.",
      ],
      items: [
        "Vercel: hospedagem do site e métricas agregadas.",
        "Resend: envio do briefing por e-mail ao estúdio.",
        "Google (API Gemini): geração das respostas do assistente virtual. As mensagens do chat são enviadas ao Google para esse processamento, então não inclua dados sensíveis na conversa.",
        "Upstash: controle de limite de envios por endereço IP.",
        "Ferramentas de automação e de gestão de contatos usadas pelo estúdio para organizar os pedidos recebidos.",
      ],
    },
    {
      heading: "Por quanto tempo os dados ficam guardados",
      paragraphs: [
        "O site não mantém banco de dados próprio com briefings nem com o histórico do chat. O briefing chega por e-mail ao estúdio e fica guardado enquanto durar a negociação ou a relação comercial, e depois pelo prazo exigido por lei. O histórico do chat existe apenas no seu navegador e some quando você fecha ou recarrega a página.",
      ],
    },
    {
      heading: "Seus direitos",
      paragraphs: [
        "Você pode pedir a confirmação de que seus dados são tratados, o acesso a eles, a correção, a exclusão, a portabilidade e informações sobre o compartilhamento, além de se opor ao tratamento ou revogar um consentimento. Basta escrever para o e-mail abaixo; a resposta sai em até 15 dias. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).",
      ],
    },
    {
      heading: "Mudanças nesta política",
      paragraphs: [
        "Esta página é atualizada sempre que a forma de tratar os dados muda. A data no topo indica a versão em vigor.",
      ],
    },
  ],
  contactLabel: "Contato para assuntos de privacidade",
};

const en: PrivacyContent = {
  eyebrow: "Legal / Privacy",
  title: "Privacy Policy",
  lead: "What data this site collects, what it is used for, who it is shared with and how to request access or deletion.",
  updatedLabel: "Last updated",
  updatedAt: "November 13, 2026",
  blocks: [
    {
      heading: "Who is responsible",
      paragraphs: [
        "MendeShift is the digital studio of José Luiz Mendes, based in Vitória, Brazil. He is the controller of the personal data processed by this site under Brazil's General Data Protection Law (LGPD, Law 13,709/2018).",
      ],
    },
    {
      heading: "Data you send",
      items: [
        "Briefing form: name, email, WhatsApp number and company (the last two are optional), type of service, budget range, desired timeline and the project description. The submission also records the page language and, when present, the campaign that brought you here (UTM parameters).",
        "Virtual assistant: the messages you type in the chat. If you give your name and a contact during the conversation, they are forwarded to the studio so it can reply.",
        "Direct contact: anything you send through WhatsApp, email or social networks is handled on those platforms, under their own policies.",
      ],
    },
    {
      heading: "Data collected automatically",
      items: [
        "IP address: used for up to 24 hours to limit repeated form and chat submissions and prevent abuse. It is not linked to your name.",
        "Usage and performance metrics: pages visited, traffic source, device type and loading time, collected in aggregate by Vercel Web Analytics and Speed Insights. These tools use no cookies and do not identify individual visitors.",
        "Browser preferences: one cookie stores your chosen language, and session storage keeps the scroll position and the source campaign. There are no advertising or cross-site tracking cookies.",
      ],
    },
    {
      heading: "What the data is used for",
      items: [
        "Answering your request and preparing a proposal, at your request, before a possible contract (LGPD art. 7, V).",
        "Protecting the site against spam and abuse and understanding, in aggregate, which pages work, based on the studio's legitimate interest (art. 7, IX).",
      ],
      paragraphs: [
        "Your data is not sold or used to send third-party advertising.",
      ],
    },
    {
      heading: "Who the data is shared with",
      paragraphs: [
        "The site relies on providers that process data on the studio's behalf. Some of them keep servers outside Brazil.",
      ],
      items: [
        "Vercel: site hosting and aggregate metrics.",
        "Resend: delivery of the briefing by email to the studio.",
        "Google (Gemini API): generation of the virtual assistant's replies. Chat messages are sent to Google for this processing, so do not include sensitive data in the conversation.",
        "Upstash: rate limiting by IP address.",
        "Automation and contact-management tools the studio uses to organize incoming requests.",
      ],
    },
    {
      heading: "How long the data is kept",
      paragraphs: [
        "The site keeps no database of its own with briefings or chat history. The briefing reaches the studio by email and is kept while the negotiation or business relationship lasts, and afterwards for the period required by law. The chat history exists only in your browser and is gone when you close or reload the page.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask for confirmation that your data is processed, access to it, correction, deletion, portability and information about sharing, and you can object to processing or withdraw consent. Write to the email below; you will get a reply within 15 days. You can also file a complaint with Brazil's National Data Protection Authority (ANPD).",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "This page is updated whenever the way data is handled changes. The date at the top shows the version in force.",
      ],
    },
  ],
  contactLabel: "Contact for privacy matters",
};

export function getPrivacyContent(locale: string): PrivacyContent {
  return locale === "pt" ? pt : en;
}
