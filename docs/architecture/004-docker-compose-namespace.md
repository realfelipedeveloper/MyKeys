# Docker Compose local

## Objetivo

Registrar a base de infraestrutura local criada na `TASK-005` da SPEC-001.

## Namespace

O Compose usa o namespace `mykeys` por padrão:

```yaml
name: ${MYKEYS_COMPOSE_PROJECT_NAME:-mykeys}
```

O nome pode ser ajustado por ambiente para cenários isolados, mas deve manter
identidade clara do projeto MyKeys.

## Rede

A rede privada inicial é:

```yaml
mykeys_private
```

Ela usa labels:

- `io.github.realfelipedeveloper.project: mykeys`;
- `io.github.realfelipedeveloper.namespace: mykeys`.

## Serviços

Ate a `TASK-008`, os servicos reais sao:

- `postgres`: PostgreSQL local.
- `redis`: Redis local.
- `mailpit`: SMTP e UI local para captura de e-mails de desenvolvimento.

Servicos restantes entram nas tarefas:

- `TASK-009`: MinIO.

## Portas

As portas oficiais ficam em `.env.example`:

| Variavel                       | Porta |
| ------------------------------ | ----- |
| `MYKEYS_WEB_PORT`              | 43110 |
| `MYKEYS_CORE_API_PORT`         | 43120 |
| `MYKEYS_PAYMENT_API_PORT`      | 43121 |
| `MYKEYS_NOTIFICATION_API_PORT` | 43122 |
| `MYKEYS_POSTGRES_PORT`         | 43130 |
| `MYKEYS_REDIS_PORT`            | 43140 |
| `MYKEYS_MAIL_SMTP_PORT`        | 43150 |
| `MYKEYS_MAIL_UI_PORT`          | 43151 |
| `MYKEYS_MINIO_PORT`            | 43160 |
| `MYKEYS_MINIO_CONSOLE_PORT`    | 43161 |

## Validação

O comando `pnpm check:compose` valida:

- parse do Compose via Docker CLI;
- nome do projeto `mykeys`;
- PostgreSQL e Redis como servicos reais nesta etapa;
- ausencia de `container_name`;
- ausencia de portas comuns proibidas no Compose;
- portas oficiais da SPEC-001 em `.env.example`;
- bind do PostgreSQL apenas em `127.0.0.1`;
- bind do Redis apenas em `127.0.0.1`;
- bind do SMTP e UI do Mailpit apenas em `127.0.0.1`;
- volumes nomeados e healthchecks de PostgreSQL e Redis.
- Mailpit efemero, sem volume persistente na `TASK-008`;
- labels de propriedade vinculadas a `realfelipedeveloper`, sem referencias
  legadas a organizacoes externas.
