# Threat model - TASK-004

## Escopo

Configuracao de TypeScript strict, ESLint, Prettier e path aliases para os apps
e packages existentes.

Nao ha implementacao real de autenticacao, criptografia, banco, Redis, filas,
storage, cloud ou dados sensiveis nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                                         | Mitigacao                                                                 |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Spoofing               | Alias `@mykeys/*` pode apontar para package incorreto.                     | `tools/alias-smoke.ts` e `tools/check-workspace.mjs` validam os destinos. |
| Tampering              | Targets Nx podem deixar de chamar `tsc`, ESLint ou smoke tests.            | `tools/check-workspace.mjs` valida comandos por projeto.                  |
| Repudiation            | Mudancas de formato podem mascarar alteracoes funcionais.                  | Prettier fica separado e documentado como gate.                           |
| Information disclosure | Arquivos de config/tooling podem introduzir segredos acidentalmente.       | Validadores mantem varredura de termos sensiveis nos shells.              |
| Denial of service      | Typecheck/lint type-aware pode ficar pesado conforme o monorepo crescer.   | Config atual escopa regras type-aware aos arquivos `.ts`.                 |
| Elevation of privilege | Dependencias de tooling podem executar build scripts ou binarios externos. | Dependencias sao dev-only, fixadas em versoes exatas e auditadas.         |

## Abuse cases

- Inserir segredo em shell TypeScript: mitigado por checks de conteudo sensivel.
- Adicionar alias para caminho fora de `packages/*`: mitigado por validacao do
  `tsconfig.base.json`.
- Executar TypeScript direto em producao local sem loader controlado: evitado;
  apps chamam o runtime `.mjs` por CLI.
- Atualizar TypeScript para versao incompativel com `typescript-eslint`:
  mitigado por pin exato e lição registrada.

## Riscos residuais

- `minimumReleaseAgeExclude` contem excecoes exatas para a familia
  `typescript-eslint@8.67.0` e deve ser revisado periodicamente.
- `baseUrl` esta silenciado com `ignoreDeprecations: "6.0"` ate uma migracao
  futura compativel com TypeScript 7.
- Quando Next.js/NestJS entrarem, os aliases tambem precisarao ser refletidos no
  bundler/framework correspondente.
