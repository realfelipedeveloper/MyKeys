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
- 2026-08-12: Cada tarefa deve receber texto de PR e texto de merge para
  `feature/* -> development`, `development -> homologation` e
  `homologation -> main`, sempre em português.
- 2026-08-12: A primeira inclusão de workflow GitHub Actions precisa ser
  promovida pelas branches de ambiente; os checks ficam visíveis de forma
  consistente depois que o workflow existir na branch base do PR.
- 2026-08-12: Abertura automática de PRs de promoção deve ser feita por
  workflow em `push` para `development` e `homologation`, evitando duplicatas e
  mantendo merge manual. PRs criados com `GITHUB_TOKEN` podem exigir aprovação
  manual dos checks; `MYKEYS_AUTOMATION_TOKEN` fica reservado como alternativa.
- 2026-08-12: A automação completa de Git Flow também precisa ouvir `push` em
  `feature/**` para abrir PR automaticamente para `development`; proteger só as
  branches de promoção não cobre o início do fluxo.
- 2026-08-12: Para `GITHUB_TOKEN` abrir PRs, o repositório precisa de
  `Workflow permissions: Read and write` e `Allow GitHub Actions to create and
approve pull requests`; como a permissão também habilita aprovação, o workflow
  deve bloquear `gh pr review` em validação local.
- 2026-08-12: PR criado por `GITHUB_TOKEN` pode não disparar `pull_request` CI;
  o workflow de abertura automática deve chamar `gh workflow run "MyKeys CI"` na
  branch de origem para materializar a validação.
- 2026-08-12: O CI precisa separar concorrência por `github.event_name`; caso
  contrário, uma validação `workflow_dispatch` pode cancelar a validação de
  `push` exigida pelo ruleset.
- 2026-08-12: Ruleset de promoção deve exigir o check `validate workspace`, mas
  sem política estrita de branch atualizada, porque `homologation` e `main`
  acumulam commits de merge próprios durante o Git Flow.
- 2026-08-12: `workflow_dispatch` pode passar sem aparecer no resumo do PR; a
  automação deve publicar um commit status `validate workspace` apontando para o
  run aprovado para satisfazer o ruleset sem fingir validação.
- 2026-08-12: Documentos legados que mencionem `develop` devem ser atualizados
  para o fluxo atual `development -> homologation -> main`.
- 2026-08-13: A imagem oficial `postgres` em PostgreSQL 18 usa `PGDATA`
  versionado em `/var/lib/postgresql/18/docker`; volumes devem montar
  `/var/lib/postgresql`, nao o caminho antigo `/var/lib/postgresql/data`.
- 2026-08-13: Para infraestrutura local sem secrets commitados, PostgreSQL pode
  usar `POSTGRES_HOST_AUTH_METHOD=trust` somente quando publicado em loopback e
  sem dados reais.
- 2026-08-13: Promoções automáticas não devem usar apenas `ahead_by` como sinal
  de mudança; merges entre branches de ambiente podem deixar commits à frente
  sem diff de arquivos e gerar PRs vazios.
- 2026-08-13: Redis local deve ser publicado apenas em loopback, com porta host
  nao padrao e sem segredos em `.env.example`; qualquer uso real precisa
  reavaliar licenca, autenticacao, ACLs e proibicao de plaintext.
