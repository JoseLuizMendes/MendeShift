<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- Principle 1 -> I. Portfolio Como Produto Estrategico
	- Principle 2 -> II. Narrativa Com Prova de Execucao
	- Principle 3 -> III. Design System Original e Consistente
	- Principle 4 -> IV. Motion Com Proposito e Controle
	- Principle 5 -> V. Entrega Incremental com Qualidade Mensuravel

- Added sections:
	- Padroes Operacionais
	- Workflow e Quality Gates
- Removed sections:
	- Nenhuma
- Templates requiring updates:
	- updated: specify/.specify/templates/plan-template.md
	- updated: specify/.specify/templates/spec-template.md
	- updated: specify/.specify/templates/tasks-template.md
	- pending: specify/.specify/templates/commands/*.md (diretorio nao encontrado)
- Deferred TODOs:
	- Nenhum
-->

# MendeShift Constitution

## Core Principles

### I. Portfolio Como Produto Estrategico
Toda decisao de produto, conteudo e engenharia MUST reforcar um posicionamento
profissional claro. O portfolio MUST funcionar como ativo de carreira e conversao,
nao como galeria de projetos sem contexto.

### II. Narrativa Com Prova de Execucao
Cada secao principal MUST responder quem construi, qual problema foi resolvido,
como a solucao foi executada e qual impacto foi gerado. Projetos MUST ser descritos
como mini case studies com Contexto, Problema, Solucao, Stack e Impacto.

### III. Design System Original e Consistente
A interface MUST seguir um sistema de design reutilizavel com tokens de tipografia,
espacamento, cor e motion. O projeto MUST evitar copia literal de referencias e
MUST produzir composicoes originais, consistentes e responsivas.

### IV. Motion Com Proposito e Controle
Animacoes MUST comunicar hierarquia, estado ou feedback. Motion decorativo sem
funcao MUST NOT ser introduzido. Efeitos MUST preservar legibilidade, desempenho e
controle de intensidade em diferentes dispositivos.

### V. Entrega Incremental com Qualidade Mensuravel
Cada incremento MUST ser validavel de forma independente, com criterios objetivos
de sucesso. Toda mudanca MUST incluir verificacoes de regressao visual/funcional,
clareza de copy e aderencia ao sistema de design.

## Padroes Operacionais

- Stack principal MUST permanecer alinhada com Next.js, React e TypeScript.
- Componentes de UI MUST ser orientados a reutilizacao e composicao, evitando
	duplicacao estrutural.
- Cada nova secao de pagina MUST explicitar CTA e intencao de conversao.
- Conteudo MUST priorizar clareza, profundidade e autoridade tecnica; descricoes
	superficiais SHOULD ser recusadas em revisao.
- Acessibilidade basica MUST ser preservada: ordem semantica, contraste, foco e
	textos alternativos em imagens.

## Workflow e Quality Gates

1. Descoberta: definir posicionamento, audiencia e objetivo da iteracao.
2. Arquitetura de conteudo: validar hierarquia Hero -> About -> Projects -> Proof -> Contact.
3. Design e implementacao: aplicar tokens, padroes de componente e motion com proposito.
4. Validacao: revisar narrativa, consistencia visual, performance e responsividade.
5. Publicacao: somente apos todos os gates obrigatorios estarem conformes.

Gates obrigatorios para aprovar uma entrega:

- Gate de Narrativa: proposta de valor e prova de execucao estao explicitas.
- Gate de Sistema: tipografia, espacamento, cor e motion seguem tokens oficiais.
- Gate de Conversao: CTA principal e trilha de acao estao claros.
- Gate de Qualidade: sem regressao visual critica em desktop e mobile.

## Governance

Esta constituicao prevalece sobre preferencias locais de implementacao em conflitos
de direcao de produto, design e qualidade.

Mudancas na constituicao MUST seguir este fluxo:

1. Proposta escrita com motivacao, impacto e secoes alteradas.
2. Classificacao de versao semantica:
	 - MAJOR: remocao ou redefinicao incompativel de principios.
	 - MINOR: adicao de principio, gate ou secao normativa.
	 - PATCH: clarificacao editorial sem mudanca de comportamento.
3. Atualizacao sincronizada de templates afetados e registro no Sync Impact Report.
4. Aprovacao final por revisao humana antes de uso em novas especificacoes.

Toda revisao de `plan.md`, `spec.md` e `tasks.md` MUST declarar conformidade com
os principios desta constituicao.

**Version**: 1.0.0 | **Ratified**: 2026-03-12 | **Last Amended**: 2026-03-12
