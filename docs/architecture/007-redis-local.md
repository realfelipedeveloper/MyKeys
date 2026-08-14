# Redis local

## Objetivo

Registrar o servico Redis local criado na `TASK-007` da SPEC-001.

## Servico

O Compose define o servico:

```yaml
redis:
  image: ${MYKEYS_REDIS_IMAGE:-redis:8.10-alpine}
```

Ele pertence ao namespace `mykeys`, usa a rede privada `mykeys_private` e nao
define `container_name`.

## Porta

O Redis e exposto apenas em loopback:

```text
127.0.0.1:${MYKEYS_REDIS_PORT:-43140}:6379
```

A porta `6379` permanece somente dentro do container. A porta do host continua
sendo `43140`, conforme a SPEC-001.

## Dados

O volume nomeado e:

```text
mykeys_redis_data
```

Ele e montado em `/data`. A persistencia append-only fica habilitada para
preservar estado local de desenvolvimento.

## Seguranca local

Redis nao recebe senha nesta etapa para evitar secret ou placeholder sensivel no
repositorio. O bind em `127.0.0.1` limita a exposicao ao host local. Ambientes
reais devem substituir isso por secret management, rede privada de ambiente e
politicas de acesso antes de qualquer deploy.

Redis nao deve armazenar segredos descriptografados, senha-mestra, chaves,
tokens sensiveis, recovery keys, CVV ou conteudo do cofre em plaintext.

## Healthcheck

O healthcheck usa:

```text
redis-cli -h 127.0.0.1 ping
```

## Fora de escopo

- cache contracts;
- filas;
- TTLs de dominio;
- Sentinel;
- Cluster;
- ACLs;
- dados reais;
- backup;
- conexao das aplicacoes.
