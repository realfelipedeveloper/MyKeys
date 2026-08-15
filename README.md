# MyKeys — Base Oficial de Engenharia

Este diretório contém a especificação oficial do MyKeys para execução pelo Codex em Engineering Loop.

## Ordem obrigatória de leitura

1. `docs/01-project-constitution.md`
2. `AGENTS.md`
3. `docs/02-agents-catalog.md`
4. `docs/03-skills-catalog.md`
5. `docs/04-system-architecture.md`
6. `docs/05-cryptography-architecture.md`
7. `docs/06-persistent-context.md`
8. `docs/07-engineering-loop.md`
9. `docs/08-quality-gates.md`
10. `docs/09-security-gates.md`
11. `docs/10-mcp-catalog.md`
12. `docs/11-roadmap.md`
13. `specs/001-platform-foundation/spec.md`

## Regra principal

Nenhum agente pode implementar código antes de:

- carregar o contexto persistente;
- validar a especificação ativa;
- identificar impactos;
- definir testes;
- revisar ameaças;
- registrar critérios de aceite;
- confirmar que as portas do host estão livres.

## Estado de implementação

### SPEC-001 / TASK-001

Status: concluida.

Fundação criada:

- workspace Nx inicial;
- pnpm fixado via `packageManager`;
- lockfile pnpm;
- layout `apps/` e `packages/`;
- scripts base `lint`, `typecheck`, `test` e `build`;
- validação local do workspace;
- aprovação explícita de build script do `nx`;
- override de segurança para dependência transitiva vulnerável.

Comandos:

```bash
corepack enable
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm nx show projects
```

### SPEC-001 / TASK-002

Status: concluida.

Apps criados:

- `apps/web`;
- `apps/docs`;
- `apps/core-api`;
- `apps/payment-api`;
- `apps/notification-api`;
- `apps/worker`;
- `apps/notification-worker`.

Cada app possui targets Nx para `serve`, `build`, `lint`, `typecheck` e
`test`. Nesta tarefa os apps sao shells minimos; Next.js, NestJS, Tailwind,
TypeScript strict e testes reais entram nas tarefas especificas da SPEC-001.

### SPEC-001 / TASK-003

Status: concluida.

Packages criados:

- `packages/ui`;
- `packages/contracts`;
- `packages/config`;
- `packages/observability`;
- `packages/testing`;
- `packages/crypto`;
- `packages/shared`.

Cada package possui targets Nx para `build`, `lint`, `typecheck` e `test`.
Nesta tarefa os packages sao shells minimos e privados; implementacoes reais entram nas tarefas especificas da SPEC-001.

### SPEC-001 / TASK-004

Status: concluida.

Tooling configurado:

- TypeScript strict com `tsconfig.base.json`;
- ESLint flat config;
- Prettier como gate de formato;
- aliases `@mykeys/*` apontando para `packages/*/src/index.ts`;
- smoke test de aliases em `tools/alias-smoke.ts`;
- apps migrados para `apps/*/src/main.ts`;
- packages migrados para `packages/*/src/index.ts`.

Comandos principais:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### SPEC-001 / TASK-005

Status: concluida.

Infra local iniciada:

- `compose.yaml` com namespace `mykeys`;
- rede privada `mykeys_private`;
- `.env.example` com portas nao comuns da SPEC-001;
- validador `pnpm check:compose`;
- sem serviços reais ainda, preservando PostgreSQL, Redis, Mailpit e MinIO para
  as tasks dedicadas.

Comandos principais:

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
```

### SPEC-001 / TASK-006

Status: concluida.

PostgreSQL local adicionado:

- servico `postgres` no `compose.yaml`;
- imagem oficial `postgres:18-alpine`;
- porta host `43130` publicada apenas em `127.0.0.1`;
- banco e usuario locais `mykeys`;
- autenticacao local `trust` para evitar secrets no repositorio nesta fase;
- volume nomeado `mykeys_postgres_data`;
- healthcheck com `pg_isready`;
- validacao local de imagem, porta, volume, rede e healthcheck.

Comandos principais:

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
docker compose --env-file .env.example -f compose.yaml up -d postgres
```

### SPEC-001 / TASK-007

Status: concluida.

Redis local adicionado:

- servico `redis` no `compose.yaml`;
- imagem oficial `redis:8.10-alpine`;
- porta host `43140` publicada apenas em `127.0.0.1`;
- volume nomeado `mykeys_redis_data`;
- persistencia local append-only ativada;
- healthcheck com `redis-cli ping`;
- validacao local de imagem, porta, volume, rede e healthcheck.

Comandos principais:

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
docker compose --env-file .env.example -f compose.yaml up -d redis
```

### SPEC-001 / TASK-008

Status: concluida.

Mailpit local adicionado:

- servico `mailpit` no `compose.yaml`;
- imagem oficial `axllent/mailpit:v1.30.7`;
- SMTP publicado apenas em `127.0.0.1:43150`;
- UI publicada apenas em `127.0.0.1:43151`;
- healthcheck HTTP em `/readyz`;
- execucao como usuario nao-root `65534:65534`;
- captura efemera sem volume persistente nesta etapa.

Comandos principais:

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
docker compose --env-file .env.example -f compose.yaml up -d mailpit
```

### SPEC-001 / TASK-009

Status: concluida.

MinIO local adicionado:

- servico `minio` no `compose.yaml`;
- imagem `cgr.dev/chainguard/minio` pinada por digest;
- API S3 publicada apenas em `127.0.0.1:43160`;
- Console publicada apenas em `127.0.0.1:43161`;
- volume nomeado `mykeys_minio_data`;
- healthcheck HTTP em `/minio/health/ready`;
- execucao como usuario nao-root `65532:65532`;
- sem secrets commitados para root credentials.

Comandos principais:

```bash
pnpm check:compose
docker compose --env-file .env.example -f compose.yaml config
docker compose --env-file .env.example -f compose.yaml up -d minio
```

### SPEC-001 / TASK-016

Status: concluida antecipadamente.

Governança e CI/CD inicial:

- branches remotas `development` e `homologation` criadas;
- branch padrão do repositório ajustada para `development`;
- fluxo obrigatório `feature/*` -> `development` -> `homologation` -> `main`;
- workflow `.github/workflows/ci.yml` com lint, typecheck, test, build, audit,
  Nx projects e validação do Docker Compose;
- workflow `.github/workflows/promotions.yml` para abrir PR automático de
  `feature/*` para `development`, de `development` para `homologation` e de
  `homologation` para `main`;
- validadores locais `pnpm check:ci` e `pnpm check:promotions`.

Comandos principais:

```bash
pnpm check:ci
pnpm check:promotions
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Stack consolidada

- Monorepo: Nx + pnpm
- Frontend: Next.js + React + TypeScript strict + Tailwind CSS
- Backend: NestJS + TypeScript strict
- Banco: PostgreSQL
- ORM: Prisma
- Cache e filas: Redis + BullMQ
- E-mail local: Mailpit
- Object storage local: MinIO
- Infra local: Docker Compose
- Testes: Jest, Testing Library, Supertest, Testcontainers, Playwright, Pact, StrykerJS, fast-check, k6 e OWASP ZAP
- Arquitetura: microsserviços pragmáticos, DDD pragmático, Clean Architecture, SOLID, Ports and Adapters
- Segurança: zero knowledge, Argon2id, AEAD, WebAuthn, TOTP, recovery keys, OWASP ASVS
- Identidade: MyKeys, paleta azul-marinho, Design System próprio
