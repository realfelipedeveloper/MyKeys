# Runbook - Docker Compose local

## Objetivo

Orientar o uso da base Docker Compose local do MyKeys.

## Pré-requisitos

- Docker instalado;
- Docker Compose v2 disponivel via `docker compose`;
- nenhuma porta oficial da SPEC-001 em conflito.

## Configuração

Use `.env.example` como referencia para variaveis locais. O arquivo `.env` real
nao deve ser commitado.

Variaveis de namespace:

- `MYKEYS_COMPOSE_PROJECT_NAME=mykeys`;
- `MYKEYS_DOCKER_NETWORK=mykeys_private`.

## Validação

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
```

## Subida local

Na `TASK-005`, ainda nao ha serviços reais para subir. As proximas tarefas
adicionam PostgreSQL, Redis, Mailpit e MinIO.

Quando houver serviços, use:

```bash
docker compose --env-file .env -f compose.yaml up
```

## Cuidados

- Nao usar `container_name`.
- Nao usar portas comuns como `3000`, `3001`, `5432`, `6379` ou `8080` no host.
- Nao inserir segredos reais em `.env.example`.
- Nao executar comandos destrutivos globais de Docker.
