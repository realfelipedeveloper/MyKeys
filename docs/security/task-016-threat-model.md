# Threat model - TASK-016

## Escopo

Criação de branches de ambiente, ajuste da branch padrão para `development`,
pipeline inicial de GitHub Actions e abertura automática de PRs de promoção.

Não há deploy, ambientes cloud, publicação de artefatos ou credenciais
obrigatórias nesta tarefa. `MYKEYS_AUTOMATION_TOKEN` é opcional e deve ser
configurado apenas como secret do GitHub se for necessário evitar aprovação
manual dos checks em PRs criados por automação.

## STRIDE

| Categoria              | Risco nesta tarefa                                            | Mitigação                                                                  |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Spoofing               | PRs podem mirar branch errada e burlar o fluxo.               | `development` vira branch padrão e o fluxo é documentado.                  |
| Tampering              | Workflow pode deixar de executar gates obrigatórios.          | `tools/check-ci.mjs` valida comandos obrigatórios do CI.                   |
| Repudiation            | Promoções podem ficar sem rastreio claro.                     | Cada etapa exige PR e merge com textos em português.                       |
| Information disclosure | Workflow pode expor secrets por engano.                       | CI usa `contents: read`; token de promoção é opcional e limitado a PRs.    |
| Denial of service      | CI pode ficar lento ou bloquear merges por falha operacional. | Pipeline inicial reutiliza gates locais e tem timeout definido.            |
| Elevation of privilege | `pull_request_target` poderia executar código não confiável.  | Workflows não usam `pull_request_target` e validadores bloqueiam esse uso. |

## Abuse cases

- Abrir feature direto para `main`: mitigado por branch padrão `development` e
  regra documentada.
- Consumir secrets no CI inicial: bloqueado por escopo e validador.
- Remover `pnpm audit` ou `pnpm test` do workflow: bloqueado por
  `tools/check-ci.mjs`.
- Criar PR duplicado de promoção: bloqueado por consulta prévia via `gh pr
list`.
- Fazer merge automático indevido: bloqueado por `tools/check-promotions.mjs`.
- Usar action com permissão excessiva: mitigado por `permissions: contents:
read`.

## Riscos residuais

- Branch protection com checks obrigatórios deve ser endurecida depois que o
  workflow estiver presente nas branches base.
- O pipeline ainda é CI; CD real depende de ambientes e serviços futuros.
- Sem `MYKEYS_AUTOMATION_TOKEN`, PRs criados por automação podem exigir
  aprovação manual dos checks pelo GitHub.
