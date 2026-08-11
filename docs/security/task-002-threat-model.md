# Threat model - TASK-002

## Escopo

Criacao dos shells iniciais dos apps Nx:

- `web`;
- `docs`;
- `core-api`;
- `payment-api`;
- `notification-api`;
- `worker`;
- `notification-worker`.

Nao ha autenticacao, dados de usuario, banco, Redis, filas, cofre, billing real
ou notificacoes reais nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                    | Mitigacao                                                                            |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Spoofing               | Apps ainda nao autenticam usuarios.                   | Sem superficies autenticadas nesta tarefa. Autenticacao fica fora de escopo.         |
| Tampering              | Manifestos de app podem divergir do registro central. | `tools/check-apps.mjs` compara `app.config.json` com `tools/mykeys-apps.mjs`.        |
| Repudiation            | Nao ha auditoria de negocio.                          | Nao ha eventos de negocio nesta tarefa. Observabilidade entra em tarefas futuras.    |
| Information disclosure | Logs poderiam expor variaveis de ambiente.            | Runtime loga apenas nome do app, runtime, status, porta e nome da variavel de porta. |
| Denial of service      | Portas HTTP podem estar ocupadas.                     | Startup smoke usa portas nao comuns da SPEC-001 e falha em conflito.                 |
| Elevation of privilege | Nao ha autorizacao nesta tarefa.                      | Nenhuma operacao privilegiada foi implementada.                                      |

## Abuse cases

- Rodar app HTTP em porta comum: mitigado por defaults da SPEC-001.
- Inserir segredo em config de app: mitigado por configs sem valores sensiveis e
  varredura de termos sensiveis antes da conclusao.
- Quebrar descoberta Nx ao alterar scripts globais: mitigado por
  `tools/check-workspace.mjs`.

## Riscos residuais

- Os health checks oficiais ainda nao existem; entram em `TASK-011`.
- Lint, typecheck e testes reais ainda serao substituidos pelas ferramentas das
  tarefas posteriores.
