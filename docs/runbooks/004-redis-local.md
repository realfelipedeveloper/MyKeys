# Runbook - Redis local

## Objetivo

Orientar o uso do Redis local do MyKeys.

## Configuracao

Use `.env.example` como base para `.env` local.

Variaveis principais:

- `MYKEYS_REDIS_IMAGE=redis:8.10-alpine`;
- `MYKEYS_REDIS_PORT=43140`;
- `MYKEYS_REDIS_DATA_VOLUME=mykeys_redis_data`.

## Validacao

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
```

## Subir o Redis

```bash
docker compose --env-file .env.example -f compose.yaml up -d redis
```

## Verificar status

```bash
docker compose --env-file .env.example -f compose.yaml ps redis
```

## Testar ping local

```bash
docker compose --env-file .env.example -f compose.yaml exec -T redis redis-cli ping
```

## Encerrar containers locais

```bash
docker compose --env-file .env.example -f compose.yaml down
```

Esse comando nao remove o volume nomeado. Para preservar dados locais de
desenvolvimento, nao use `-v` sem uma decisao explicita.

## Cuidados

- Nao usar porta host `6379`.
- Nao expor o servico fora de `127.0.0.1`.
- Nao commitar `.env` real.
- Nao adicionar senha, token ou secret real ao `.env.example`.
- Nao gravar segredos descriptografados no Redis.
- Nao usar `docker compose down -v` sem confirmar que os dados locais podem ser
  descartados.
