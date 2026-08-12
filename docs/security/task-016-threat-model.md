# Threat model - TASK-016

## Escopo

Criação de branches de ambiente, ajuste da branch padrão para `development` e
pipeline inicial de GitHub Actions.

Não há deploy, secrets, ambientes cloud, publicação de artefatos ou credenciais
nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                            | Mitigação                                                               |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Spoofing               | PRs podem mirar branch errada e burlar o fluxo.               | `development` vira branch padrão e o fluxo é documentado.               |
| Tampering              | Workflow pode deixar de executar gates obrigatórios.          | `tools/check-ci.mjs` valida comandos obrigatórios do CI.                |
| Repudiation            | Promoções podem ficar sem rastreio claro.                     | Cada etapa exige PR e merge com textos em português.                    |
| Information disclosure | Workflow pode expor secrets por engano.                       | CI usa `contents: read` e não referencia `secrets.*`.                   |
| Denial of service      | CI pode ficar lento ou bloquear merges por falha operacional. | Pipeline inicial reutiliza gates locais e tem timeout definido.         |
| Elevation of privilege | `pull_request_target` poderia executar código não confiável.  | Workflow usa `pull_request` e validador bloqueia `pull_request_target`. |

## Abuse cases

- Abrir feature direto para `main`: mitigado por branch padrão `development` e
  regra documentada.
- Consumir secrets no CI inicial: bloqueado por escopo e validador.
- Remover `pnpm audit` ou `pnpm test` do workflow: bloqueado por
  `tools/check-ci.mjs`.
- Usar action com permissão excessiva: mitigado por `permissions: contents:
read`.

## Riscos residuais

- Branch protection com checks obrigatórios deve ser endurecida depois que o
  workflow estiver presente nas branches base.
- O pipeline ainda é CI; CD real depende de ambientes e serviços futuros.
