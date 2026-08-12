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

### SPEC-001 / TASK-016

Status: concluida antecipadamente.

Governança e CI/CD inicial:

- branches remotas `development` e `homologation` criadas;
- branch padrão do repositório ajustada para `development`;
- fluxo obrigatório `feature/*` -> `development` -> `homologation` -> `main`;
- workflow `.github/workflows/ci.yml` com lint, typecheck, test, build, audit,
  Nx projects e validação do Docker Compose;
- validador local `pnpm check:ci`.

Comandos principais:

```bash
pnpm check:ci
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
- Infra local: Docker Compose
- Testes: Jest, Testing Library, Supertest, Testcontainers, Playwright, Pact, StrykerJS, fast-check, k6 e OWASP ZAP
- Arquitetura: microsserviços pragmáticos, DDD pragmático, Clean Architecture, SOLID, Ports and Adapters
- Segurança: zero knowledge, Argon2id, AEAD, WebAuthn, TOTP, recovery keys, OWASP ASVS
- Identidade: MyKeys, paleta azul-marinho, Design System próprio
