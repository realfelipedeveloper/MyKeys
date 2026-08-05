# ADR-002 - Scaffold minimo de apps

## Status

Accepted

## Contexto

A SPEC-001 define sete apps iniciais, mas separa a criacao dos apps
(`TASK-002`) das tarefas de TypeScript strict, ESLint, Jest, Tailwind, docs
navegaveis, health checks e frameworks finais.

Adicionar Next.js, NestJS, Tailwind e runners de teste completos nesta tarefa
misturaria escopos planejados para `TASK-004`, `TASK-012`, `TASK-018`,
`TASK-022` e `TASK-023`.

## Decisão

Criar os sete apps como shells Nx minimos e executaveis, sem novas
dependencias:

- cada app tem `project.json`, `app.config.json` e `src/main.mjs`;
- os targets `serve`, `build`, `lint`, `typecheck` e `test` usam
  `nx:run-commands`;
- apps HTTP usam as portas nao comuns ja definidas na SPEC-001;
- `docs` e workers iniciam como processos sem porta;
- scripts em `tools/` validam manifestos, startup smoke e build de shell.

## Alternativas

- Usar geradores `@nx/next` e `@nx/nest`: adiado para manter a sequencia da
  SPEC-001 e evitar dependencias grandes antes das tarefas de tooling.
- Criar apenas diretorios vazios: rejeitado porque nao comprovaria que os apps
  iniciam nem que o Nx os descobre.

## Consequências positivas

- A `TASK-002` fica pequena, testavel e sem dependencias novas.
- O Nx passa a descobrir todos os apps requeridos.
- Os scripts formais executam targets por projeto.
- O startup smoke valida que os apps HTTP sobem e respondem localmente.

## Consequências negativas

- Os apps ainda nao usam Next.js, NestJS, React, TypeScript ou Tailwind.
- Os health checks formais continuam fora de escopo ate `TASK-011`.

## Riscos

- Os shells precisam ser substituidos com cuidado quando os frameworks reais
  forem introduzidos.
- As futuras tarefas devem manter os mesmos nomes de projeto para preservar os
  contratos Nx ja criados.

## Referências

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0001-nx-pnpm-workspace.md`
