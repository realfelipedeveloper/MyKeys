# Relatorio de Conclusao - SPEC-001 TASK-016

## Tarefa

TASK-016 - Criar pipeline GitHub Actions.

## Objetivo

Sanar a incongruência de Git Flow antes da continuidade das tasks de
infraestrutura, criando branches intermediárias e um CI inicial.

## Arquivos alterados

- `.github/workflows/ci.yml`;
- `.github/workflows/promotions.yml`;
- `tools/check-ci.mjs`;
- `tools/check-promotions.mjs`;
- `tools/check-workspace.mjs`;
- `package.json`;
- `nx.json`;
- `AGENTS.md`;
- `.agents/constraints.md`;
- `.agents/active-feature.json`;
- `.agents/lessons-learned.md`;
- `README.md`;
- `specs/001-platform-foundation/tasks.md`;
- `docs/adr/0006-git-flow-e-ci-inicial.md`;
- `docs/architecture/005-git-flow-cicd.md`;
- `docs/runbooks/002-git-flow-promotions.md`;
- `docs/security/task-016-threat-model.md`.

## Decisões

- Criar branches remotas `development` e `homologation`.
- Ajustar branch padrão do repositório para `development`.
- Adotar fluxo `feature/* -> development -> homologation -> main`.
- Registrar que toda tarefa deve receber texto de PR e texto de merge para
  `development`, `homologation` e `main`.
- Criar CI inicial com GitHub Actions e gates locais existentes.
- Criar automação para abrir PR de `feature/*` para `development` após push em
  branch de feature.
- Criar automação para abrir PR de `development` para `homologation` e de
  `homologation` para `main` após merges.
- Ignorar promoções sem arquivos alterados, mesmo quando houver commits à frente
  por merges entre branches de ambiente.
- Habilitar no repositório permissão de workflow para criação de PRs pelo
  GitHub Actions.
- Disparar `MyKeys CI` pela automação após criar ou detectar PR com mudanças
  pendentes.
- Separar a concorrência do CI por tipo de evento para evitar cancelamento entre
  `push` e `workflow_dispatch`.
- Publicar o commit status `validate workspace` somente após o CI disparado pela
  automação passar.
- Ajustar o ruleset remoto para exigir `validate workspace` sem política estrita
  de branch atualizada antes do merge.
- Não implementar deploy automático nesta task.

## Testes executados

- `pnpm check:ci`;
- `pnpm check:promotions`;
- `pnpm check:workspace`;
- `pnpm lint`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`;
- `pnpm audit --audit-level high`;
- `pnpm nx show projects`;
- `docker compose --env-file .env.example -f compose.yaml config --format json`;
- verificação de branches remotas;
- verificação do ruleset remoto `MyKeys Git Flow protections`.

## Resultados

Branches `development` e `homologation` foram criadas. O repositório passou a
usar `development` como branch padrão. O workflow de CI inicial foi adicionado
com validações de lint, typecheck, testes, build, audit, Nx e Compose.
O fluxo também passou a exigir textos de PR e merge para cada etapa de promoção
até `main`.
O workflow `MyKeys Promotions` abre automaticamente PRs de feature e o próximo
PR de promoção quando `feature/*`, `development` ou `homologation` recebem
novos commits com arquivos alterados em relação ao destino.
O CI separa a concorrência por evento para que validações manuais disparadas
pela automação não cancelem validações de `push`. O ruleset remoto exige o
check `validate workspace`, mas mantém desabilitada a política estrita de
branch atualizada para preservar o fluxo de promoção.
Quando o CI manual passa, a automação publica o commit status obrigatório no SHA
promovido e aponta para o run real do GitHub Actions.

Em 13 de agosto de 2026, a automação foi ajustada para não abrir PR de promoção
quando `development`, `homologation` ou `main` divergem apenas por commits de
merge, sem diff de arquivos. Essa correção evita PRs vazios e ciclos de
promoção após sincronizações manuais.

## Verificações de segurança

- Workflow usa permissões mínimas `contents: read`.
- Workflow de promoção usa `pull-requests: write` somente para abrir PRs.
- Workflow de promoção usa `actions: write` para disparar `MyKeys CI`.
- Workflow de promoção usa `statuses: write` somente para publicar o resultado
  aprovado do CI como status obrigatório.
- Workflow de promoção não faz aprovação, merge ou push.
- Workflow não usa `pull_request_target`.
- CI baseline não referencia `secrets.*`.
- `MYKEYS_AUTOMATION_TOKEN` é opcional para reduzir fricção dos checks em PRs
  criados por automação.
- Nenhuma dependência npm nova foi adicionada.
- Actions utilizadas são oficiais e usam runtime Node 24:
  `actions/checkout@v5` e `actions/setup-node@v5`.
- Cache automático do `setup-node` permanece desabilitado.
- Ruleset remoto mantém PR obrigatório, bloqueio de deleção, bloqueio de
  force push e status check obrigatório.

## Riscos residuais

- Branch protection deve ser endurecida depois que o workflow estiver presente
  nas branches de base.
- CD real permanece fora de escopo.
- A primeira promoção do workflow é uma etapa de bootstrap.
- PRs criados com `GITHUB_TOKEN` podem exigir aprovação manual dos checks pelo
  GitHub.
- A permissão de Actions para criar PRs também habilita aprovação por Actions na
  configuração do GitHub; o workflow é validado para não executar aprovação.
- Alterações manuais futuras no ruleset podem reintroduzir exigência estrita de
  branch atualizada e bloquear PRs de promoção.

## Rollback

Reverter o commit da `TASK-016` remove o workflow e a documentação. A mudança
de branch padrão e branches remotas deve ser revertida via configuração do
GitHub caso seja necessário.

## Documentação atualizada

- ADR-006;
- arquitetura Git Flow/CI;
- runbook de promoções;
- threat model da tarefa;
- README.

## Memória persistente atualizada

- `AGENTS.md`;
- `.agents/constraints.md`;
- `.agents/active-feature.json`;
- `.agents/lessons-learned.md`.

## Status final

Concluida.
