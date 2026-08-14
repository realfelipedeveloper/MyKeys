# ADR-009 - Mailpit local via Docker Compose

## Status

Accepted

## Contexto

A `TASK-008` da SPEC-001 exige adicionar Mailpit a infraestrutura local. A base
Docker Compose ja possui PostgreSQL e Redis com namespace MyKeys, portas nao
comuns, bind em loopback, healthchecks e labels de propriedade do repositorio.

Mailpit sera usado apenas como ferramenta local de captura de e-mails de
desenvolvimento. A tarefa nao deve configurar relay externo, envio real,
autenticacao SMTP de dominio, templates de notificacao ou integracao das
aplicacoes.

Em 14 de agosto de 2026, a documentacao oficial do Mailpit informa imagem
Docker oficial `axllent/mailpit`, portas internas padrao `1025` para SMTP e
`8025` para UI, tags estaveis por release, e healthcheck HTTP via `/livez` e
`/readyz`. A release mais recente consultada e `v1.30.7`.

## Decisao

Adicionar o servico `mailpit` ao `compose.yaml` com:

- imagem `axllent/mailpit:v1.30.7`;
- bind SMTP em `127.0.0.1:${MYKEYS_MAIL_SMTP_PORT:-43150}:1025`;
- bind UI em `127.0.0.1:${MYKEYS_MAIL_UI_PORT:-43151}:8025`;
- `MP_MAX_MESSAGES=500` como limite local configuravel;
- healthcheck HTTP em `/readyz` usando `wget` disponivel na imagem;
- usuario nao-root `65534:65534`;
- rede privada `mykeys_private`;
- labels do namespace MyKeys com prefixo `io.github.realfelipedeveloper`;
- sem `container_name`;
- sem volume persistente e sem relay externo nesta etapa.

Atualizar validadores, README, runbook, arquitetura, threat model, memoria
persistente e relatorio de conclusao para cobrir Mailpit.

## Alternativas

- Usar `latest`: rejeitado para evitar drift de versao sem revisao.
- Usar porta host `1025` ou `8025`: rejeitado pela regra de portas nao comuns
  e pela SPEC-001.
- Persistir mensagens em volume: rejeitado nesta tarefa para reduzir retencao
  acidental de dados sensiveis em e-mails de desenvolvimento.
- Configurar relay externo: rejeitado porque envio real esta fora de escopo.
- Adicionar autenticacao local na UI: rejeitado nesta etapa porque nao ha
  segredo permitido no repositorio e o bind fica restrito a loopback.

## Consequencias positivas

- E-mails de desenvolvimento passam a ser capturados localmente.
- A UI de inspecao fica disponivel na porta oficial `43151`.
- O SMTP local fica disponivel na porta oficial `43150`.
- A caixa efemera reduz risco de retencao acidental.
- Healthcheck prepara a base para a futura `TASK-011`.

## Consequencias negativas

- Mensagens capturadas somem ao recriar o container.
- UI local sem autenticacao nao pode ser exposta fora do host.
- Ainda nao ha integracao das aplicacoes com SMTP local.

## Riscos

- Enviar dados reais para Mailpit pode vazar informacoes sensiveis no ambiente
  local.
- Expor UI ou SMTP fora de loopback permitiria acesso indevido.
- Configurar relay externo poderia enviar e-mails reais por engano.
- Persistir a caixa local poderia reter tokens, links ou dados pessoais de
  testes.

## Referencias

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
- `docs/adr/0007-postgresql-local.md`
- `docs/adr/0008-redis-local.md`
- `docs/09-security-gates.md`
- https://mailpit.axllent.org/docs/install/docker/
- https://mailpit.axllent.org/docs/integration/healthcheck/
- https://github.com/axllent/mailpit/releases
