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

Ate a `TASK-009`, PostgreSQL, Redis, Mailpit e MinIO estao disponiveis. Para
subir todos os servicos atuais, use:

```bash
docker compose --env-file .env.example -f compose.yaml up -d postgres redis mailpit minio
```

Para subir apenas Redis:

```bash
docker compose --env-file .env.example -f compose.yaml up -d redis
```

Para subir apenas Mailpit:

```bash
docker compose --env-file .env.example -f compose.yaml up -d mailpit
```

Mailpit fica disponivel em:

- SMTP local: `127.0.0.1:43150`;
- UI local: `http://127.0.0.1:43151`.

Para subir apenas MinIO:

```bash
docker compose --env-file .env.example -f compose.yaml up -d minio
```

MinIO fica disponivel em:

- API S3 local: `http://127.0.0.1:43160`;
- Console local: `http://127.0.0.1:43161`.

Para uso com variaveis locais, copie `.env.example` para `.env` e ajuste apenas
valores nao sensiveis.

## Cuidados

- Nao usar `container_name`.
- Nao usar portas comuns como `3000`, `3001`, `5432`, `6379` ou `8080` no host.
- Nao inserir segredos reais em `.env.example`.
- Nao gravar segredos descriptografados no Redis.
- Nao enviar e-mails reais, dados pessoais reais ou tokens reais para Mailpit.
- Nao gravar arquivos reais, anexos reais ou dados pessoais reais no MinIO
  local.
- Nao executar comandos destrutivos globais de Docker.
- Nao usar `docker compose down -v` sem decisao explicita de descarte dos dados
  locais.
