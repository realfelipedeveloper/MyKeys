# Threat model - TASK-007

## Escopo

Adicao do Redis local ao Docker Compose do MyKeys.

Nao ha cache de dominio, filas, TTLs, dados reais, conexao de aplicacoes,
ambiente remoto, ACLs, Sentinel ou Cluster nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                                 | Mitigacao                                                            |
| ---------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Spoofing               | Aplicacoes podem apontar para Redis fora do namespace MyKeys.      | Servico, rede, volume e labels usam namespace `mykeys`.              |
| Tampering              | Dados locais podem ser alterados diretamente no volume.            | Volume e local; nao ha dados reais nem contratos de cache.           |
| Repudiation            | Operacoes locais no Redis nao possuem trilha de auditoria.         | Fora de escopo; Redis e apenas infraestrutura local.                 |
| Information disclosure | Redis pode ser exposto indevidamente na rede do host.              | Porta publicada somente em `127.0.0.1:43140`; sem porta host `6379`. |
| Denial of service      | Porta ou volume podem conflitar com outro projeto local.           | Porta nao comum validada e volume nomeado com namespace MyKeys.      |
| Elevation of privilege | Redis sem senha seria inseguro fora de loopback ou ambiente local. | Uso restrito ao local, documentado e limitado por bind em loopback.  |

## Abuse cases

- Mapear `6379:6379` no host: bloqueado por validador e restricoes ativas.
- Expor Redis em `0.0.0.0`: bloqueado por validacao de bind em loopback.
- Commitar senha em `.env.example`: evitado por escopo local e validador de
  nomes sensiveis.
- Usar `container_name`: bloqueado por `tools/check-compose.mjs`.
- Armazenar segredos descriptografados no Redis: proibido por constituicao e
  reforcado na documentacao da tarefa.

## Riscos residuais

- Redis local sem senha nao pode ser usado em ambiente remoto.
- O volume local pode conter dados de teste e deve ser removido apenas com
  decisao explicita.
- A licenca da linha Redis 8 deve ser reavaliada antes de ambientes reais.
- Healthchecks formais dos demais servicos permanecem para a `TASK-011`.
