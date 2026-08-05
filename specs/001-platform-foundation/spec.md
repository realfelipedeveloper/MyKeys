# SPEC-001 — Fundação da Plataforma MyKeys

## Status

Approved

## Objetivo

Criar a fundação executável do monorepo MyKeys, sem implementar ainda funcionalidades de negócio do cofre.

## Escopo

- Nx;
- pnpm;
- apps iniciais;
- packages compartilhados;
- TypeScript strict;
- lint;
- format;
- Docker Compose;
- PostgreSQL;
- Redis;
- Mailpit;
- MinIO;
- health checks;
- portas configuráveis;
- scripts de verificação;
- CI inicial;
- documentação;
- Design System base;
- memória persistente.

## Aplicações

- `apps/web`
- `apps/docs`
- `apps/core-api`
- `apps/payment-api`
- `apps/notification-api`
- `apps/worker`
- `apps/notification-worker`

## Pacotes

- `packages/ui`
- `packages/contracts`
- `packages/config`
- `packages/observability`
- `packages/testing`
- `packages/crypto`
- `packages/shared`

## Portas padrão do host

```dotenv
MYKEYS_WEB_PORT=43110
MYKEYS_CORE_API_PORT=43120
MYKEYS_PAYMENT_API_PORT=43121
MYKEYS_NOTIFICATION_API_PORT=43122
MYKEYS_POSTGRES_PORT=43130
MYKEYS_REDIS_PORT=43140
MYKEYS_MAIL_SMTP_PORT=43150
MYKEYS_MAIL_UI_PORT=43151
MYKEYS_MINIO_PORT=43160
MYKEYS_MINIO_CONSOLE_PORT=43161
```

As portas devem ser configuráveis e verificadas antes da subida.

## Requisitos funcionais

1. Todos os apps devem iniciar.
2. Todos os serviços devem expor health checks.
3. O Docker Compose deve usar namespace exclusivo.
4. O frontend deve exibir uma página inicial MyKeys.
5. A identidade inicial deve usar Tailwind e paleta azul-marinho.
6. O Design System deve conter Button, Input, Card, Alert e Modal base.
7. A documentação deve ser navegável.
8. O pipeline deve executar lint, typecheck, unit e build.
9. Testcontainers deve ser configurado.
10. A memória persistente deve existir.

## Requisitos não funcionais

- nenhum uso de portas comuns;
- nenhum `container_name` rígido;
- containers com usuário não root quando possível;
- health checks;
- imagens multi-stage;
- sem secrets commitados;
- `.env.example`;
- logs estruturados;
- graceful shutdown;
- TypeScript strict.

## Testes

- unitários dos pacotes base;
- teste de configuração;
- teste de health check;
- teste de conflito de porta;
- teste de inicialização do Compose;
- teste de renderização dos componentes;
- teste de acessibilidade dos componentes;
- teste E2E simples da landing.

## Critérios de aceite

- `pnpm install` funciona;
- `pnpm lint` passa;
- `pnpm typecheck` passa;
- `pnpm test` passa;
- `pnpm build` passa;
- `docker compose up` sobe somente os serviços MyKeys;
- nenhuma porta conflita;
- documentação é acessível;
- CI está ativa;
- sem vulnerabilidade crítica conhecida;
- contexto persistente atualizado.

## Fora de escopo

- cadastro;
- autenticação;
- criptografia;
- cofre;
- billing;
- notificações reais;
- cloud.

## Agentes obrigatórios

- Orchestrator;
- Software Architect;
- DevOps;
- Backend;
- Frontend;
- QA;
- Security;
- Documentation;
- Product Design.

## Engineering Loop

Aplicar integralmente `docs/07-engineering-loop.md`.
