# ADR-004 - TypeScript strict, ESLint, Prettier e aliases

## Status

Accepted

## Contexto

A `TASK-004` da SPEC-001 exige configurar TypeScript strict, ESLint, Prettier e
path aliases antes da introducao dos frameworks reais. Os apps e packages ainda
sao shells, mas precisam validar contratos minimos com tooling real para evitar
deriva estrutural nas proximas tarefas.

## Decisão

Configurar o workspace com:

- `typescript@6.0.3`, fixado por compatibilidade com `typescript-eslint`;
- `eslint@10.8.1` com flat config;
- `typescript-eslint@8.67.0` com regras type-aware apenas para arquivos `.ts`;
- `prettier@3.9.6` como gate de formato;
- `@types/node@24.13.3`, alinhado ao runtime Node 24 local;
- aliases `@mykeys/*` em `tsconfig.base.json`;
- smoke test `tools/alias-smoke.ts` para validar resolucao dos aliases.

Os apps foram migrados para `src/main.ts` com metadados tipados. O runtime local
permanece em `tools/app-runtime.mjs` e pode ser chamado por CLI para evitar
execucao direta de TypeScript pelo Node.

Os packages foram migrados para `src/index.ts` e continuam privados. Seus
targets emitem JavaScript em `dist/packages/*` antes do smoke de import.

## Alternativas

- Usar `typescript@7.0.2`: rejeitado porque a versao atual do
  `typescript-eslint` aceita TypeScript menor que `6.1.0`.
- Usar `ts-node` ou loader runtime para executar `.ts`: rejeitado nesta tarefa
  para nao adicionar superficie runtime antes dos frameworks.
- Manter lint/typecheck como validacoes estruturais: rejeitado porque a
  `TASK-004` exige tooling real.

## Consequências positivas

- Todos os 14 projetos Nx possuem lint e typecheck reais.
- O build passa a exigir emit TypeScript antes de gerar manifests.
- Aliases `@mykeys/*` ficam centralizados e validados.
- Prettier vira gate explicito para evitar churn de estilo futuro.

## Consequências negativas

- `baseUrl` precisa de `ignoreDeprecations: "6.0"` ate a migracao futura para o
  modelo recomendado pelo TypeScript 7.
- O `pnpm` registrou excecoes exatas de `minimumReleaseAgeExclude` para a
  familia `typescript-eslint@8.67.0`; isso deve ser revisado quando as versoes
  deixarem de depender desse atalho de supply-chain.

## Riscos

- Drift entre aliases e packages reais.
- Drift entre targets Nx e arquivos `tsconfig` por projeto.
- Atualizacoes futuras de TypeScript podem exigir remocao de `baseUrl`.
- Regras type-aware podem ficar caras quando os frameworks reais entrarem.

## Referências

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0001-nx-pnpm-workspace.md`
- `docs/adr/0002-scaffold-minimo-de-apps.md`
- `docs/adr/0003-scaffold-minimo-de-packages.md`
