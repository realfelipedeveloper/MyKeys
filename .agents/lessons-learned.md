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
