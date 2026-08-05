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
