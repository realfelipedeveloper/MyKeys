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

A `TASK-006` adicionou PostgreSQL. Para subir os servicos disponiveis, use:

```bash
docker compose --env-file .env.example -f compose.yaml up -d postgres
```

Para uso com variaveis locais, copie `.env.example` para `.env` e ajuste apenas
valores nao sensiveis.

## Cuidados

- Nao usar `container_name`.
- Nao usar portas comuns como `3000`, `3001`, `5432`, `6379` ou `8080` no host.
- Nao inserir segredos reais em `.env.example`.
- Nao executar comandos destrutivos globais de Docker.
- Nao usar `docker compose down -v` sem decisao explicita de descarte dos dados
  locais.
