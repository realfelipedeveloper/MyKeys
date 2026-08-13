# Runbook - Git Flow e promoções

## Fluxo padrão

```text
feature/* -> development -> homologation -> main
```

## Feature para development

1. Criar a branch da task a partir de `development`.
2. Implementar, testar e documentar.
3. Fazer push da branch `feature/*`.
4. Confirmar o PR automático aberto de `feature/*` para `development`.
5. Ajustar o texto do PR em português quando necessário.
6. Aguardar CI.
7. Fazer merge com texto em português.
8. Encaminhar texto de merge em português.

## Development para homologation

1. Confirmar o PR automático aberto de `development` para `homologation`.
2. Encaminhar texto de PR em português.
3. Confirmar que o conjunto de mudanças está pronto para homologação.
4. Aguardar CI.
5. Fazer merge com texto em português.
6. Encaminhar texto de merge em português.

## Homologation para main

1. Confirmar o PR automático aberto de `homologation` para `main`.
2. Encaminhar texto de PR em português.
3. Confirmar que não há regressões conhecidas.
4. Aguardar CI.
5. Fazer merge com texto em português.
6. Encaminhar texto de merge em português.

## Regras

- Não abrir PR de feature direto para `main`.
- Não fazer commit direto em `development`, `homologation` ou `main`.
- Não pular `homologation` antes de `main`.
- Textos de PR e merge devem conter resumo, validações, impacto e riscos.
- Toda tarefa deve ter texto de PR e texto de merge para as três etapas de
  promoção: `development`, `homologation` e `main`.
- O workflow `MyKeys Promotions` abre automaticamente PR de `feature/*` para
  `development` após push na branch de feature.
- O workflow `MyKeys Promotions` abre automaticamente o próximo PR de promoção
  após merge em `development` ou `homologation`.
- A automação dispara o workflow `MyKeys CI` após abrir ou atualizar a
  necessidade de promoção.
- O CI separa a concorrência por evento (`push`, `pull_request` e
  `workflow_dispatch`) para que uma validação manual disparada pela automação
  não cancele a validação de `push` exigida pelo ruleset.
- Depois que o `workflow_dispatch` do CI passa, a automação publica o commit
  status `validate workspace` apontando para o run real. Isso materializa o
  check obrigatório em PRs criados automaticamente pelo `GITHUB_TOKEN`.
- A automação não faz merge, não faz push e não cria PR duplicado.
- A automação não deve abrir PR quando a comparação entre origem e destino tiver
  commits à frente, mas nenhum arquivo alterado. Esses casos são ruído de
  sincronização entre branches de ambiente.
- A automação não aprova PRs.
- O repositório deve manter `Workflow permissions` em `Read and write` e
  `Allow GitHub Actions to create and approve pull requests` habilitado para que
  o `GITHUB_TOKEN` consiga abrir PRs automaticamente.
- O ruleset `MyKeys Git Flow protections` deve exigir PR e o status check
  `validate workspace`, mas não deve exigir política estrita de branch
  atualizada antes do merge. No fluxo de promoção, `homologation` e `main`
  acumulam commits de merge próprios, então a exigência estrita gera bloqueio
  falso mesmo quando a comparação de conteúdo é válida.
- Se o PR automático for criado com `GITHUB_TOKEN`, o GitHub pode exigir
  aprovação manual para executar checks. O workflow também dispara `MyKeys CI`
  via `workflow_dispatch` para reduzir essa fricção. Para execução sem
  aprovação manual em cenários mais restritivos, configurar um token de
  automação em `MYKEYS_AUTOMATION_TOKEN`.
- Se aparecer um PR de promoção sem arquivos alterados, ele deve ser fechado
  como no-op e a automação deve ser revisada antes de seguir abrindo novas
  promoções.
