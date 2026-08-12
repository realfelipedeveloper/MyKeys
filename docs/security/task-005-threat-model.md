# Threat model - TASK-005

## Escopo

Criacao da base de Docker Compose com namespace MyKeys e variaveis locais de
porta em `.env.example`.

Nao ha containers de banco, Redis, Mailpit, MinIO, aplicacoes, secrets, dados
persistidos ou comunicacao real entre serviços nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                                | Mitigacao                                                                     |
| ---------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Spoofing               | Recursos Docker podem ser confundidos com outro projeto local.    | `name: mykeys`, rede `mykeys_private` e labels de namespace.                  |
| Tampering              | Compose pode ser alterado para usar `container_name` ou serviços. | `tools/check-compose.mjs` valida ausencia de `container_name` e de serviços.  |
| Repudiation            | Nao ha auditoria de eventos Docker nesta tarefa.                  | Fora de escopo; runbook registra comandos esperados.                          |
| Information disclosure | `.env.example` pode receber segredos reais por engano.            | `.env.example` contem apenas namespace e portas; validador bloqueia segredos. |
| Denial of service      | Portas comuns podem conflitar com ferramentas locais.             | Portas da SPEC-001 ficam em faixa nao comum e sao verificadas.                |
| Elevation of privilege | Containers podem rodar com privilégios indevidos no futuro.       | Nenhum container real nesta tarefa; requisito fica registrado para proximas.  |

## Abuse cases

- Subir serviço fora do namespace MyKeys: mitigado por `name`, rede e labels.
- Fixar `container_name` e quebrar isolamento local: bloqueado pelo validador.
- Usar portas comuns do host: bloqueado por validação e restrições persistentes.
- Commitar segredos no `.env.example`: mitigado por escopo do arquivo e
  varredura de nomes sensiveis.

## Riscos residuais

- As tarefas `TASK-006` a `TASK-009` precisam manter labels, rede e ausência de
  `container_name`.
- `docker compose up` so tera comportamento verificavel quando houver serviços
  reais.
