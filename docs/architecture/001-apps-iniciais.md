# Apps iniciais

## Objetivo

Registrar os apps criados na `TASK-002` da SPEC-001.

## Apps

| App | Caminho | Runtime inicial | Porta |
| --- | --- | --- | --- |
| web | `apps/web` | HTTP shell | `MYKEYS_WEB_PORT`, padrao `43110` |
| docs | `apps/docs` | process shell | sem porta nesta tarefa |
| core-api | `apps/core-api` | HTTP shell | `MYKEYS_CORE_API_PORT`, padrao `43120` |
| payment-api | `apps/payment-api` | HTTP shell | `MYKEYS_PAYMENT_API_PORT`, padrao `43121` |
| notification-api | `apps/notification-api` | HTTP shell | `MYKEYS_NOTIFICATION_API_PORT`, padrao `43122` |
| worker | `apps/worker` | process shell | sem porta |
| notification-worker | `apps/notification-worker` | process shell | sem porta |

## Targets

Cada app define:

- `serve`;
- `build`;
- `lint`;
- `typecheck`;
- `test`.

Os targets usam `nx:run-commands` e chamam scripts locais em `tools/`.

## Limites atuais

Esta tarefa nao configura ainda:

- Next.js;
- NestJS;
- TypeScript strict;
- ESLint real;
- Jest;
- Tailwind;
- health checks formais;
- Docker Compose.
