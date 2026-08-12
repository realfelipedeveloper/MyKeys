# Git Flow e CI/CD inicial

## Objetivo

Registrar a governança de branches e o pipeline inicial da `TASK-016`.

## Branches

| Branch         | Função                                    |
| -------------- | ----------------------------------------- |
| `development`  | Integração contínua das features          |
| `homologation` | Estabilização e validação antes da `main` |
| `main`         | Linha estável                             |
| `feature/*`    | Implementação de tasks                    |
| `release/*`    | Preparação futura de releases             |
| `hotfix/*`     | Correções urgentes                        |

## Promoção

O fluxo obrigatório é:

```text
feature/* -> development -> homologation -> main
```

Branches `feature/*` devem partir de `development`. Promoções entre ambientes
devem ser feitas por PR.

O workflow `.github/workflows/promotions.yml` automatiza a abertura dos PRs de
promoção:

- push em `feature/*` abre PR para `development`;
- push/merge em `development` abre PR para `homologation`;
- push/merge em `homologation` abre PR para `main`.

A automação compara origem e destino, não cria PR duplicado e não executa merge
automaticamente.

Para permitir criação automática de PR com `GITHUB_TOKEN`, o repositório deve
manter `Workflow permissions` em `Read and write` e permitir que GitHub Actions
crie pull requests. Os workflows continuam declarando permissões mínimas por
arquivo.

Após abrir ou detectar um PR de promoção com mudanças pendentes, a automação
dispara `MyKeys CI` por `workflow_dispatch` na branch de origem para garantir
validação mesmo quando o PR foi criado pelo `GITHUB_TOKEN`.

O CI usa concorrência separada por `github.event_name`, evitando que a validação
manual por `workflow_dispatch` cancele a validação de `push` que também pode ser
exigida pelo ruleset.

Quando o CI disparado por `workflow_dispatch` passa, o workflow de promoções
publica o commit status `validate workspace` no SHA de origem e aponta esse
status para o run real. Essa etapa materializa o check obrigatório em PRs
criados por automação, já que o GitHub pode não associar automaticamente o run
manual ao resumo do PR.

O ruleset remoto `MyKeys Git Flow protections` protege `development`,
`homologation` e `main`, exige PR, bloqueia deleção e force push, e exige o
check `validate workspace`. A política estrita de branch atualizada permanece
desabilitada para não bloquear PRs de promoção por divergência esperada de
commits de merge entre as branches de ambiente.

Cada tarefa deve receber texto de PR e texto de merge em português para:

- `feature/*` -> `development`;
- `development` -> `homologation`;
- `homologation` -> `main`.

## CI inicial

O workflow `.github/workflows/ci.yml` roda em PRs e pushes para:

- `development`;
- `homologation`;
- `main`.

O job `validate workspace` executa:

- instalação com lockfile congelado;
- validação Docker Compose;
- validação da automação de promoções;
- lint;
- typecheck;
- testes;
- build;
- audit de dependências;
- listagem de projetos Nx.

## CD

Não há deploy automático nesta task. O projeto ainda não possui ambientes,
serviços reais ou artefatos deployáveis. CD fica reservado para tarefas futuras
de infraestrutura e release.
