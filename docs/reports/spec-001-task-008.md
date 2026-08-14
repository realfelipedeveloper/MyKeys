# Relatorio de Conclusao - SPEC-001 TASK-008

## Tarefa

TASK-008 - Adicionar Mailpit.

## Objetivo

Adicionar Mailpit a infraestrutura local do MyKeys para capturar e inspecionar
e-mails de desenvolvimento sem envio real e sem persistencia de caixa nesta
fase.

## Arquivos alterados

- `compose.yaml`;
- `.env.example`;
- `tools/check-compose.mjs`;
- `tools/check-workspace.mjs`;
- `README.md`;
- `.agents/constraints.md`;
- `.agents/active-feature.json`;
- `.agents/lessons-learned.md`;
- `docs/adr/0009-mailpit-local.md`;
- `docs/architecture/004-docker-compose-namespace.md`;
- `docs/architecture/008-mailpit-local.md`;
- `docs/runbooks/001-docker-compose-local.md`;
- `docs/runbooks/005-mailpit-local.md`;
- `docs/security/task-008-threat-model.md`.

## Decisões

- Usar imagem `axllent/mailpit:v1.30.7`, release estavel mais recente
  verificada.
- Publicar SMTP apenas em `127.0.0.1:43150`.
- Publicar UI apenas em `127.0.0.1:43151`.
- Usar healthcheck HTTP em `/readyz`.
- Rodar o container como usuario nao-root `65534:65534`.
- Manter Mailpit efemero, sem volume persistente e sem relay externo.
- Limitar a caixa local com `MYKEYS_MAILPIT_MAX_MESSAGES=500`.

## Testes executados

- `docker manifest inspect axllent/mailpit:v1.30.7`;
- `docker manifest inspect axllent/mailpit:v1.30`;
- inspecao local da imagem para confirmar `wget` disponivel;
- `pnpm format`;
- `pnpm check:compose`;
- `pnpm check:workspace`;
- smoke local de Mailpit com:
  - verificacao das portas `43150` e `43151`;
  - `docker compose up -d mailpit`;
  - health status `healthy`;
  - `GET http://127.0.0.1:43151/readyz` com HTTP 200;
  - conexao TCP no SMTP `127.0.0.1:43150`;
  - confirmacao de UID `65534`;
  - remocao do container e da rede criada pelo smoke quando vazia.

## Resultados

Todos os comandos executados ate este relatorio passaram. O Compose resolve
PostgreSQL, Redis e Mailpit no namespace `mykeys`, sem `container_name`, sem
portas comuns no host e com Mailpit exposto apenas em loopback.

## Verificações de segurança

- Nenhuma dependencia npm foi adicionada.
- `.env.example` nao contem secrets.
- Mailpit nao configura relay externo.
- Mailpit nao usa volume persistente.
- Mailpit nao publica SMTP ou UI fora de `127.0.0.1`.
- O container do smoke executou como usuario nao-root `65534`.

## Riscos residuais

- Desenvolvedores ainda podem inserir dados reais manualmente em e-mails de
  teste; isso permanece proibido pelas restricoes do projeto.
- UI local sem autenticacao nao pode ser exposta fora do host.
- Integracao das aplicacoes com SMTP local fica fora desta tarefa.

## Rollback

Reverter o commit da `TASK-008` remove o servico `mailpit`, suas variaveis,
validacoes e documentacao dedicada, retornando a infraestrutura local ao estado
com PostgreSQL e Redis.

## Documentação atualizada

- README;
- ADR-009;
- arquitetura do Compose local;
- arquitetura do Mailpit local;
- runbook Docker Compose local;
- runbook Mailpit local;
- threat model da tarefa.

## Memória persistente atualizada

- `.agents/constraints.md`;
- `.agents/active-feature.json`;
- `.agents/lessons-learned.md`.

## Status final

Concluida.
