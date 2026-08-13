# Runbook - PostgreSQL local

## Objetivo

Orientar o uso do PostgreSQL local do MyKeys.

## Configuracao

Use `.env.example` como base para `.env` local.

Variaveis principais:

- `MYKEYS_POSTGRES_IMAGE=postgres:18-alpine`;
- `MYKEYS_POSTGRES_PORT=43130`;
- `MYKEYS_POSTGRES_DB=mykeys`;
- `MYKEYS_POSTGRES_USER=mykeys`;
- `MYKEYS_POSTGRES_AUTH_METHOD=trust`;
- `MYKEYS_POSTGRES_DATA_VOLUME=mykeys_postgres_data`.

## Validacao

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
```

## Subir o banco

```bash
docker compose --env-file .env.example -f compose.yaml up -d postgres
```

## Verificar status

```bash
docker compose --env-file .env.example -f compose.yaml ps postgres
```

## Encerrar containers locais

```bash
docker compose --env-file .env.example -f compose.yaml down
```

Esse comando nao remove o volume nomeado. Para preservar dados locais de
desenvolvimento, nao use `-v` sem uma decisao explicita.

## Cuidados

- Nao usar porta host `5432`.
- Nao expor o servico fora de `127.0.0.1`.
- Nao commitar `.env` real.
- Nao adicionar `POSTGRES_PASSWORD` ou secrets reais ao `.env.example`.
- Nao usar `docker compose down -v` sem confirmar que os dados locais podem ser
  descartados.
