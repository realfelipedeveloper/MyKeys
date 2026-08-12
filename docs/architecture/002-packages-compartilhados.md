# Packages compartilhados

## Objetivo

Registrar os packages criados na `TASK-003` da SPEC-001.

## Packages

| Package                 | Caminho                  | Responsabilidade inicial                        |
| ----------------------- | ------------------------ | ----------------------------------------------- |
| `@mykeys/ui`            | `packages/ui`            | Design System e componentes futuros             |
| `@mykeys/contracts`     | `packages/contracts`     | Contratos publicos versionados futuros          |
| `@mykeys/config`        | `packages/config`        | Configuracao compartilhada sem segredos reais   |
| `@mykeys/observability` | `packages/observability` | Logs estruturados, tracing e correlacao futuros |
| `@mykeys/testing`       | `packages/testing`       | Utilitarios de testes futuros                   |
| `@mykeys/crypto`        | `packages/crypto`        | Criptografia cliente-side futura                |
| `@mykeys/shared`        | `packages/shared`        | Tipos e utilitarios comuns futuros              |

## Targets

Cada package define:

- `build`;
- `lint`;
- `typecheck`;
- `test`.

Os targets usam `nx:run-commands` e chamam scripts locais em `tools/`.

## Limites da TASK-003

Esta tarefa nao implementa:

- componentes de UI;
- tokens Tailwind;
- schemas ou contratos publicos reais;
- validacao de configuracao;
- logger estruturado real;
- helpers de frameworks de teste;
- algoritmos criptograficos;
- path aliases TypeScript, implementados depois na `TASK-004`.
