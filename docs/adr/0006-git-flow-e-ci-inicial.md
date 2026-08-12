# ADR-006 - Git Flow com development, homologation e CI inicial

## Status

Accepted

## Contexto

O projeto documentava Git Flow, mas o repositório possuía apenas `main` e
branches `feature/*`. Isso permitia PRs de feature direto para `main` e nao
exibia checks de CI/CD na experiência de merge.

A SPEC-001 ja previa `TASK-016 - Criar pipeline GitHub Actions`, originalmente
mais adiante na lista. A tarefa foi antecipada apos a `TASK-005` para corrigir
a governança antes da continuidade da infraestrutura local.

## Decisão

Adotar o fluxo:

```text
feature/* -> development -> homologation -> main
```

Criar as branches remotas:

- `development`;
- `homologation`.

Ajustar a branch padrão do repositório para `development`.

Para cada tarefa, encaminhar texto de PR e texto de merge em português em cada
etapa de promoção:

- `feature/*` -> `development`;
- `development` -> `homologation`;
- `homologation` -> `main`.

Criar `.github/workflows/ci.yml` com validação inicial:

- `actions/checkout@v5`;
- `actions/setup-node@v5` com Node.js `24.14.1`;
- concorrência separada por evento para impedir que `workflow_dispatch` cancele
  checks de `push`;
- `pnpm install --frozen-lockfile`;
- `pnpm check:promotions`;
- `pnpm lint`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`;
- `pnpm audit --audit-level high`;
- `pnpm nx show projects`;
- `docker compose config`.

Adicionar `tools/check-ci.mjs` para validar localmente a configuração do
workflow.

Criar `.github/workflows/promotions.yml` para abrir automaticamente:

- PR de `feature/*` para `development` após push em branch de feature;
- PR de `development` para `homologation` após atualizações em `development`;
- PR de `homologation` para `main` após atualizações em `homologation`.

Adicionar `tools/check-promotions.mjs` para validar que a automação:

- promove `feature/*` para `development`;
- promove `development` para `homologation`;
- promove `homologation` para `main`;
- verifica diferenças antes de abrir PR;
- evita PR duplicado;
- dispara `MyKeys CI` após criar ou detectar PR com mudanças pendentes;
- publica o status `validate workspace` após o CI real passar;
- não usa `pull_request_target`;
- não faz merge automático, aprovação automática nem push.

Habilitar no repositório `Workflow permissions: Read and write` e `Allow GitHub
Actions to create and approve pull requests`, necessário para que `GITHUB_TOKEN`
possa abrir PRs automaticamente. Os workflows permanecem com permissões
explícitas e mínimas.

Configurar o ruleset `MyKeys Git Flow protections` para exigir PR e o status
check `validate workspace` em `development`, `homologation` e `main`, sem
política estrita de branch atualizada antes do merge. As branches de promoção
podem conter commits de merge próprios, então a exigência estrita cria bloqueio
falso para o fluxo `development -> homologation -> main`.

## Alternativas

- Manter PRs direto para `main`: rejeitado porque ignora as etapas de
  desenvolvimento e homologação desejadas.
- Usar `develop` em vez de `development`: rejeitado porque a convenção definida
  pelo owner do projeto usa `development`.
- Aguardar a posição original da `TASK-016`: rejeitado porque a ausência de CI e
  branches intermediárias bloqueava a governança de merge.

## Consequências positivas

- Novos PRs de feature passam a mirar `development` por padrão.
- A promoção de código antes de `main` fica explícita e auditável.
- Cada etapa de promoção passa a ter texto de PR e texto de merge padronizados.
- PRs de feature e de promoção passam a ser abertos automaticamente conforme a
  etapa do fluxo.
- O CI inicial passa a executar os gates locais ja existentes.
- O CI baseline usa permissões mínimas e não consome secrets.
- A automação de promoção usa permissões mínimas e aceita apenas o secret
  opcional `MYKEYS_AUTOMATION_TOKEN`.
- O validador bloqueia uso de `gh pr review`, `gh pr merge` e `git push` na
  automação de PRs.
- A automação dispara CI explicitamente para cobrir PRs criados por
  `GITHUB_TOKEN`.
- A automação materializa o resultado do CI como commit status obrigatório
  `validate workspace`, sempre apontando para o run real aprovado.
- O CI usa actions oficiais em runtime Node 24 e desabilita cache automático do
  `setup-node`.
- A concorrência do CI não cancela validações de `push` quando a automação
  dispara `workflow_dispatch`.
- O ruleset exige o check obrigatório sem bloquear promoções por divergência
  esperada de commits de merge.

## Consequências negativas

- A `TASK-016` foi executada fora da sequência numérica original.
- A primeira promoção do workflow pelas branches de ambiente é uma etapa de
  bootstrap; os checks ficam plenamente consistentes depois que o workflow
  existir na branch base.
- PRs criados pelo `GITHUB_TOKEN` podem exigir aprovação manual dos checks pelo
  GitHub; um token opcional `MYKEYS_AUTOMATION_TOKEN` remove essa fricção quando
  configurado.
- A configuração do GitHub Actions que permite criar PRs também permite aprovar
  PRs; isso deve permanecer mitigado por validação do workflow e revisão de
  mudanças nessa automação.
- A política de status check sem atualização estrita permite merge de promoção
  quando o check obrigatório passa, mesmo que a branch base tenha commits de
  merge próprios.
- A automação de promoção espera o CI terminar, então a abertura/atualização de
  PR pode levar mais tempo.

## Riscos

- Branches de ambiente podem divergir se promoções forem puladas.
- Regras de proteção do GitHub ainda precisam ser endurecidas quando os checks
  estiverem estabilizados.
- O ruleset remoto pode divergir do repositório se for alterado manualmente no
  GitHub.
- O CI inicial nao faz deploy; CD real permanece fora de escopo ate haver
  ambientes e serviços deployáveis.

## Referências

- `AGENTS.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/08-quality-gates.md`
- `docs/09-security-gates.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
