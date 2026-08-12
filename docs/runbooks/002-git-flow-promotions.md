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
- A automação não faz merge, não faz push e não cria PR duplicado.
- Se o PR automático for criado com `GITHUB_TOKEN`, o GitHub pode exigir
  aprovação manual dos checks. Para execução sem essa aprovação, configurar um
  token de automação em `MYKEYS_AUTOMATION_TOKEN`.
