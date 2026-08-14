# ADR-008 - Redis local via Docker Compose

## Status

Accepted

## Contexto

A `TASK-007` da SPEC-001 exige adicionar Redis a infraestrutura local. O
PostgreSQL local ja existe desde a `TASK-006`, usando namespace, rede privada,
portas nao comuns, healthcheck e volume nomeado.

Redis ainda nao deve receber dados reais, segredos, chaves descriptografadas ou
conteudo sensivel. A tarefa cria somente o servico local necessario para as
proximas etapas de infraestrutura e health checks.

Em 13 de agosto de 2026, as tags oficiais `redis:8.10-alpine` e
`redis:8-alpine` estavam publicadas no Docker Hub. Redis 8.10 e a linha estavel
atual informada pelas fontes oficiais consultadas. Redis 8 usa licenciamento
tri-license informado pelo projeto Redis; o uso nesta etapa e restrito a
infraestrutura local de desenvolvimento e deve ser reavaliado antes de qualquer
distribuicao comercial ou ambiente remoto.

## Decisao

Adicionar o servico `redis` ao `compose.yaml` com:

- imagem `redis:8.10-alpine`;
- bind de host em `127.0.0.1:${MYKEYS_REDIS_PORT:-43140}:6379`;
- volume nomeado `mykeys_redis_data` montado em `/data`;
- persistencia append-only local;
- healthcheck com `redis-cli ping`;
- entrypoint oficial preservado para preparar o volume e executar o processo
  `redis-server` como usuario `redis`;
- rede privada `mykeys_private`;
- labels do namespace MyKeys;
- sem `container_name`;
- sem senha ou secret no `.env.example`.

Atualizar `tools/check-compose.mjs` e `tools/check-workspace.mjs` para validar
servico, imagem, porta, volume, healthcheck, append-only e ausencia de portas
comuns no host.

## Alternativas

- Usar porta host `6379`: rejeitado pela SPEC-001 e pelas restricoes ativas.
- Usar `latest`: rejeitado para evitar drift de major/minor sem revisao.
- Usar Redis 7.x: rejeitado para evitar iniciar a fundacao com linha antiga.
- Usar Valkey: rejeitado nesta tarefa porque a SPEC-001 pede Redis.
- Adicionar senha local em `.env.example`: rejeitado para nao introduzir secret
  ou placeholder sensivel nesta fase.

## Consequencias positivas

- Redis local passa a existir no namespace MyKeys.
- A porta oficial `43140` fica validada por tooling.
- Healthcheck prepara a base para a futura `TASK-011`.
- O volume preserva dados locais de desenvolvimento quando necessario.
- O processo Redis roda sem privilegio de root no smoke local.
- A configuracao evita segredos reais no repositorio.

## Consequencias negativas

- Redis local sem senha e apropriado apenas para desenvolvimento em loopback.
- O volume pode acumular dados de desenvolvimento e deve ser gerenciado com
  cuidado.
- A licenca da linha Redis 8 deve ser reavaliada antes de ambientes reais.
- Ainda nao ha uso pelas aplicacoes, filas, cache contracts ou politicas de TTL.

## Riscos

- Expor Redis fora de loopback permitiria acesso indevido no ambiente local.
- Gravar segredos descriptografados no Redis violaria a constituicao do
  projeto.
- Alteracoes futuras podem reintroduzir porta comum, `container_name` ou imagem
  sem versao.

## Referencias

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
- `docs/adr/0007-postgresql-local.md`
- Docker Official Image `redis`
- Redis releases
