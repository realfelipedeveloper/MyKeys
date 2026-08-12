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

Criar `.github/workflows/ci.yml` com validação inicial:

- `pnpm install --frozen-lockfile`;
- `pnpm lint`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`;
- `pnpm audit --audit-level high`;
- `pnpm nx show projects`;
- `docker compose config`.

Adicionar `tools/check-ci.mjs` para validar localmente a configuração do
workflow.

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
- O CI inicial passa a executar os gates locais ja existentes.
- O workflow usa permissões mínimas e não consome secrets.

## Consequências negativas

- A `TASK-016` foi executada fora da sequência numérica original.
- A primeira promoção do workflow pelas branches de ambiente é uma etapa de
  bootstrap; os checks ficam plenamente consistentes depois que o workflow
  existir na branch base.

## Riscos

- Branches de ambiente podem divergir se promoções forem puladas.
- Regras de proteção do GitHub ainda precisam ser endurecidas quando os checks
  estiverem estabilizados.
- O CI inicial nao faz deploy; CD real permanece fora de escopo ate haver
  ambientes e serviços deployáveis.

## Referências

- `AGENTS.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/08-quality-gates.md`
- `docs/09-security-gates.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
