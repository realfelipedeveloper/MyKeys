# Tooling TypeScript

## Objetivo

Registrar a base de tooling criada na `TASK-004` da SPEC-001.

## Configuracoes raiz

- `tsconfig.base.json`: strict mode, NodeNext, aliases `@mykeys/*` e opcoes de
  seguranca de tipos.
- `tsconfig.aliases.json`: smoke test de resolucao dos aliases.
- `tsconfig.eslint.json`: projeto de lint type-aware.
- `eslint.config.mjs`: flat config para JavaScript de tooling e TypeScript de
  apps/packages.
- `.prettierrc.json` e `.prettierignore`: formato obrigatorio do workspace.

## Aliases

| Alias                   | Destino                               |
| ----------------------- | ------------------------------------- |
| `@mykeys/ui`            | `packages/ui/src/index.ts`            |
| `@mykeys/contracts`     | `packages/contracts/src/index.ts`     |
| `@mykeys/config`        | `packages/config/src/index.ts`        |
| `@mykeys/observability` | `packages/observability/src/index.ts` |
| `@mykeys/testing`       | `packages/testing/src/index.ts`       |
| `@mykeys/crypto`        | `packages/crypto/src/index.ts`        |
| `@mykeys/shared`        | `packages/shared/src/index.ts`        |

## Targets Nx

Apps:

- `serve`: chama `node tools/app-runtime.mjs <app>`;
- `lint`: chama `pnpm exec eslint apps/<app>`;
- `typecheck`: chama `pnpm exec tsc --noEmit -p apps/<app>/tsconfig.app.json`;
- `test`: executa `tools/check-apps.mjs` com smoke de startup;
- `build`: executa `tsc` com emit antes de `tools/build-app.mjs`.

Packages:

- `lint`: chama `pnpm exec eslint packages/<package>`;
- `typecheck`: chama `pnpm exec tsc --noEmit -p packages/<package>/tsconfig.lib.json`;
- `test`: executa `tools/check-packages.mjs` com smoke de import do build;
- `build`: executa `tsc` com emit antes de `tools/build-package.mjs`.

## Limites atuais

- Os apps ainda nao usam Next.js ou NestJS.
- Os packages ainda exportam apenas metadados.
- `@mykeys/crypto` segue sem algoritmos reais.
- Os aliases sao de TypeScript; runtime real sera definido nas tarefas de
  framework/build dedicadas.
