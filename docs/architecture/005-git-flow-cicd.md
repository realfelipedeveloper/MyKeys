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

- push/merge em `development` abre PR para `homologation`;
- push/merge em `homologation` abre PR para `main`.

A automação compara origem e destino, não cria PR duplicado e não executa merge
automaticamente.

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
