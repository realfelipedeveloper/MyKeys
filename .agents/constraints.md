# Restrições Ativas

- Não usar portas 3000, 3001, 5432, 6379 ou 8080 no host.
- Não usar segredos reais.
- Não implementar cloud.
- Não implementar regras de negócio fora da SPEC-001.
- Não usar Tailwind fora dos tokens do Design System.
- Não adicionar dependências sem justificativa.
- Não alterar testes para mascarar falhas.
- Mensagens de commit devem ser escritas sempre em português.
- Fluxo Git obrigatório: `feature/*` -> `development` -> `homologation` ->
  `main`.
- Não abrir PR de feature diretamente para `main`.
- Textos de pull request e merge devem ser enviados sempre em português, com
  resumo, validações, impacto e riscos quando aplicável.
- Para cada tarefa, enviar texto de PR e texto de merge para cada etapa:
  `feature/*` -> `development`, `development` -> `homologation` e
  `homologation` -> `main`.
- Após merge em `development` ou `homologation`, abrir automaticamente o PR da
  próxima promoção sem executar merge automático.
