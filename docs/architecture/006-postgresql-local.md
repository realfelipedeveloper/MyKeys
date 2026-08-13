# PostgreSQL local

## Objetivo

Registrar o servico PostgreSQL local criado na `TASK-006` da SPEC-001.

## Servico

O Compose define o servico:

```yaml
postgres:
  image: ${MYKEYS_POSTGRES_IMAGE:-postgres:18-alpine}
```

Ele pertence ao namespace `mykeys`, usa a rede privada `mykeys_private` e nao
define `container_name`.

## Porta

O PostgreSQL e exposto apenas em loopback:

```text
127.0.0.1:${MYKEYS_POSTGRES_PORT:-43130}:5432
```

A porta `5432` permanece somente dentro do container. A porta do host continua
sendo `43130`, conforme a SPEC-001.

## Dados

O volume nomeado e:

```text
mykeys_postgres_data
```

Para PostgreSQL 18, o volume e montado em `/var/lib/postgresql` e o `PGDATA`
interno fica em `/var/lib/postgresql/18/docker`.

## Autenticacao local

O ambiente local usa:

```dotenv
MYKEYS_POSTGRES_AUTH_METHOD=trust
```

Essa decisao evita commit de senha ou placeholder sensivel nesta fase. O bind em
`127.0.0.1` limita a exposicao ao host local. Ambientes reais devem substituir
isso por secret management antes de qualquer deploy.

## Healthcheck

O healthcheck usa `pg_isready` com o usuario e banco locais:

```text
pg_isready -U "$${POSTGRES_USER}" -d "$${POSTGRES_DB}" -h 127.0.0.1
```

## Fora de escopo

- Prisma;
- migracoes;
- schemas;
- conexao das aplicacoes;
- dados reais;
- backup;
- replicacao.
