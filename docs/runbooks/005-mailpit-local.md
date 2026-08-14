# Runbook - Mailpit local

## Objetivo

Orientar o uso do Mailpit local da `TASK-008`.

## Subir Mailpit

```bash
docker compose --env-file .env.example -f compose.yaml up -d mailpit
```

## Acessar UI

Abra:

```text
http://127.0.0.1:43151
```

## Usar SMTP local

Configure clientes locais para:

```text
host: 127.0.0.1
port: 43150
auth: disabled
tls: disabled
```

Dentro da rede Docker, outros containers podem usar:

```text
host: mailpit
port: 1025
```

## Validar saude

```bash
docker compose --env-file .env.example -f compose.yaml ps mailpit
```

O healthcheck interno chama:

```text
http://127.0.0.1:8025/readyz
```

Pelo host local:

```bash
curl http://127.0.0.1:43151/readyz
```

## Encerrar

```bash
docker compose --env-file .env.example -f compose.yaml down
```

Nao use `down -v` como rotina. Mesmo sem volume para Mailpit, outros servicos
podem ter volumes locais.

## Cuidados

- Nao enviar e-mails reais para Mailpit.
- Nao usar dados pessoais reais em mensagens de teste.
- Nao configurar relay externo nesta etapa.
- Nao expor `43150` ou `43151` fora de `127.0.0.1`.
- Nao adicionar volume persistente sem nova decisao de arquitetura.
