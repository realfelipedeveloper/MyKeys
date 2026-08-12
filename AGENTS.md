# AGENTS.md — MyKeys

## Objetivo

Este arquivo define o comportamento obrigatório de todos os agentes e subagentes do projeto MyKeys.

## Regras imutáveis

1. Nunca implementar sem especificação ativa.
2. Nunca remover, ignorar ou enfraquecer testes para fazer o pipeline passar.
3. Nunca armazenar plaintext de segredos, senha-mestra, chaves, recovery keys, CVV ou tokens sensíveis.
4. Nunca acessar banco de outro serviço diretamente.
5. Nunca executar comandos destrutivos globais de Docker, Git, PostgreSQL ou Redis.
6. Nunca usar portas padrão do host sem verificação.
7. Nunca introduzir dependência sem avaliação de segurança, licença e manutenção.
8. Nunca criar decisão pendente quando puder ser modelada com valor padrão configurável.
9. Nunca alterar contratos públicos sem versionamento e testes de compatibilidade.
10. Nunca concluir uma tarefa sem atualizar documentação e memória persistente.

## Sequência obrigatória por tarefa

1. Carregar constituição.
2. Carregar spec ativa.
3. Carregar ADRs e restrições.
4. Identificar serviços e módulos afetados.
5. Identificar riscos de segurança e regressão.
6. Criar ou atualizar testes.
7. Implementar a menor mudança correta.
8. Executar gates.
9. Revisar diff.
10. Atualizar contexto.
11. Emitir relatório de conclusão.

## Restrições de segurança

- A criptografia do cofre ocorre no cliente.
- O backend não recebe plaintext de itens do cofre.
- Chaves descriptografadas permanecem apenas em memória.
- Redis não armazena segredos descriptografados.
- Logs não contêm conteúdo sensível.
- Testes devem comprovar ausência de plaintext em banco, logs e tráfego interno.
- MFA e step-up authentication são obrigatórios para operações críticas.
- Autoridade comercial, autorização e feature flags são verificadas no backend.

## Git Flow

- `development`: branch padrão para integração contínua de features;
- `homologation`: branch de estabilização e homologação;
- `main`: branch estável;
- `feature/*`: branches de implementação por task;
- `release/*`: branches futuras de preparação de release;
- `hotfix/*`: correções urgentes.

Fluxo obrigatório: `feature/*` -> `development` -> `homologation` -> `main`.
Sem commits diretos em `development`, `homologation` ou `main`.
Mensagens de commit devem ser escritas sempre em português.
Textos de pull request e merge devem ser encaminhados sempre em português,
com resumo, validações, impacto e riscos quando aplicável.
Para cada tarefa, devem ser encaminhados texto de PR e texto de merge para
`feature/*` -> `development`, `development` -> `homologation` e
`homologation` -> `main`.

## Definição de pronto

Uma tarefa só está concluída quando:

- critérios de aceite passam;
- testes unitários, integração e regressão passam;
- E2E crítico aplicável passa;
- lint, format e typecheck passam;
- análise de segurança passa;
- documentação foi atualizada;
- memória persistente foi atualizada;
- relatório de conclusão foi emitido.
