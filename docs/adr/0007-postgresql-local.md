# ADR-007 - PostgreSQL local via Docker Compose

## Status

Accepted

## Contexto

A `TASK-006` da SPEC-001 exige adicionar PostgreSQL à infraestrutura local. A
base de Compose, namespace, rede privada e porta oficial ja foram criados na
`TASK-005`.

O banco ainda nao deve ser acessado por aplicacoes, nao deve receber migracoes e
nao deve armazenar dados reais ou segredos. Esta tarefa cria apenas o servico
local necessario para as proximas etapas.

Em 13 de agosto de 2026, a linha estavel atual do PostgreSQL e a 18. A imagem
oficial Docker para PostgreSQL 18 usa `PGDATA` versionado em
`/var/lib/postgresql/18/docker` e volume em `/var/lib/postgresql`. A tag
oficial `postgres:18-alpine` existe no Docker Hub; a tag minor `18.6-alpine`
nao estava publicada no momento da implementacao.

## Decisao

Adicionar o servico `postgres` ao `compose.yaml` com:

- imagem `postgres:18-alpine`;
- bind de host em `127.0.0.1:${MYKEYS_POSTGRES_PORT:-43130}:5432`;
- banco local `mykeys`;
- usuario local `mykeys`;
- `POSTGRES_HOST_AUTH_METHOD=trust` somente para ambiente local;
- `PGDATA=/var/lib/postgresql/18/docker`;
- volume nomeado `mykeys_postgres_data` montado em `/var/lib/postgresql`;
- healthcheck com `pg_isready`;
- rede privada `mykeys_private`;
- labels do namespace MyKeys;
- sem `container_name`.

Atualizar `tools/check-compose.mjs` e `tools/check-workspace.mjs` para validar o
servico, porta, volume, healthcheck, imagem e ausencia de portas comuns no host.

## Alternativas

- Usar `POSTGRES_PASSWORD` em `.env.example`: rejeitado para nao introduzir
  variavel sensivel nem placeholder de segredo nesta fase.
- Usar porta host `5432`: rejeitado pela SPEC-001 e pelas restricoes ativas.
- Montar volume diretamente em `/var/lib/postgresql/data`: rejeitado porque a
  imagem oficial do PostgreSQL 18 mudou o caminho recomendado de `PGDATA`.
- Usar imagem `latest`: rejeitado para evitar drift para outra major version.
- Usar `postgres:18.6-alpine`: rejeitado porque a tag ainda nao estava
  publicada no Docker Hub no momento da implementacao.

## Consequencias positivas

- PostgreSQL local passa a existir no namespace MyKeys.
- A porta oficial `43130` fica validada por tooling.
- O volume preserva dados locais entre reinicios sem expor caminho rigido.
- Healthcheck prepara a base para a futura `TASK-011`.
- A configuracao evita segredos reais no repositorio.

## Consequencias negativas

- `trust` e apropriado apenas para desenvolvimento local e nao pode ser
  promovido para ambientes reais.
- Ainda nao ha migracoes, schemas Prisma ou conexao das aplicacoes ao banco.
- O volume local pode acumular dados de desenvolvimento e deve ser gerenciado
  com cuidado.

## Riscos

- Expor PostgreSQL fora de loopback permitiria acesso indevido no ambiente
  local.
- Alteracoes futuras no Compose podem reintroduzir porta comum ou
  `container_name`.
- Versoes futuras da imagem oficial podem mudar novamente caminhos de dados.

## Referencias

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
- `docs/09-security-gates.md`
- Docker Official Image `postgres`
- PostgreSQL 18 release
