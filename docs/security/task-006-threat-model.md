# Threat model - TASK-006

## Escopo

Adicao do PostgreSQL local ao Docker Compose do MyKeys.

Nao ha migracoes, schemas Prisma, dados reais, backup, replicacao, conexao de
aplicacoes ou ambiente remoto nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                            | Mitigacao                                                            |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Spoofing               | Aplicacoes podem apontar para banco fora do namespace MyKeys. | Servico, rede, volume e labels usam namespace `mykeys`.              |
| Tampering              | Dados locais podem ser alterados diretamente no volume.       | Volume e local; nao ha dados reais ou migracoes nesta tarefa.        |
| Repudiation            | Alteracoes locais no banco nao possuem trilha de auditoria.   | Fora de escopo; banco e apenas infraestrutura local.                 |
| Information disclosure | Banco pode ser exposto indevidamente na rede do host.         | Porta publicada somente em `127.0.0.1:43130`; sem porta host `5432`. |
| Denial of service      | Porta ou volume podem conflitar com outro projeto local.      | Porta nao comum validada e volume nomeado com namespace MyKeys.      |
| Elevation of privilege | Configuracao `trust` poderia ser insegura fora do localhost.  | Uso restrito ao local, documentado e limitado por bind em loopback.  |

## Abuse cases

- Mapear `5432:5432` no host: bloqueado por validador e restricoes ativas.
- Expor PostgreSQL em `0.0.0.0`: bloqueado por validacao de bind em loopback.
- Commitar senha em `.env.example`: evitado pela decisao de usar `trust` local e
  pelo validador de nomes sensiveis.
- Usar `container_name`: bloqueado por `tools/check-compose.mjs`.
- Montar volume no caminho antigo do PostgreSQL: bloqueado por validacao de
  `PGDATA` e target do volume.

## Riscos residuais

- `trust` nao pode ser usado em ambiente remoto.
- O volume local pode conter dados de teste e deve ser removido apenas com
  decisao explicita.
- Healthcheck formal dos demais servicos permanece para a `TASK-011`.
