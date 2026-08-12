# Lições Aprendidas

- 2026-08-05: `pnpm@11.20.0` keeps dependency build-script approvals in
  `pnpm-workspace.yaml`; `nx@23.1.1` requires `allowBuilds.nx: true`.
- 2026-08-05: `nx@23.1.1` pulled `brace-expansion@5.0.8`, which had a high
  advisory. The workspace pins `brace-expansion@5.0.9` through pnpm overrides.
- 2026-08-05: Targets Nx que dependem de scripts em `tools/` precisam incluir
  `tools/**/*.mjs` nos inputs compartilhados para evitar cache obsoleto.
- 2026-08-05: Na `TASK-002`, os apps foram criados como shells minimos para
  preservar a ordem da SPEC-001; frameworks reais entram nas tarefas dedicadas.
- 2026-08-05: Na `TASK-003`, os packages foram criados como shells privados e
  importaveis. O package `@mykeys/crypto` deve permanecer sem algoritmos reais
  ate haver testes criptograficos dedicados.
- 2026-08-11: Na `TASK-004`, `typescript@7.0.2` estava fora da faixa aceita por
  `typescript-eslint@8.67.0`; o workspace usa `typescript@6.0.3` ate haver
  compatibilidade oficial.
- 2026-08-11: `baseUrl` em TypeScript 6 exige `ignoreDeprecations: "6.0"` para
  manter aliases `paths` sem quebrar o gate. A migracao deve ser revista antes
  de TypeScript 7.
- 2026-08-11: No Windows com `fnm`, `pnpm` pode estar disponivel apenas como
  `pnpm.ps1`; validadores Node que chamam `pnpm exec` precisam usar shell com
  argumentos controlados ou outro wrapper portavel.
- 2026-08-12: Textos de pull request e merge devem ser enviados sempre em
  português, com resumo, validações, impacto e riscos quando aplicável.
- 2026-08-12: `docker compose config --format json` valida um Compose minimo
  com `services: {}` sem subir containers; isso permite criar o namespace antes
  dos serviços reais da infra local.
- 2026-08-12: O repositório deve usar `development` como branch padrão de
  trabalho, promovendo mudanças por PR em `development -> homologation -> main`;
  PRs de feature direto para `main` escondem o fluxo esperado.
- 2026-08-12: A primeira inclusão de workflow GitHub Actions precisa ser
  promovida pelas branches de ambiente; os checks ficam visíveis de forma
  consistente depois que o workflow existir na branch base do PR.
