# Threat model - TASK-008

## Escopo

Adicao do Mailpit local ao Docker Compose do MyKeys.

Nao ha relay externo, envio real, integracao das aplicacoes, templates,
autenticacao da UI, POP3, volume persistente ou dados reais nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                              | Mitigacao                                                                  |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Spoofing               | Aplicacoes podem apontar para SMTP fora do namespace MyKeys.    | Servico, rede e labels usam namespace `mykeys`; integracao ainda fora.     |
| Tampering              | Mensagens capturadas podem ser alteradas pela UI local.         | Uso restrito a desenvolvimento; sem dados reais e sem persistencia.        |
| Repudiation            | Operacoes na UI local nao possuem trilha de auditoria.          | Fora de escopo; Mailpit e ferramenta local efemera.                        |
| Information disclosure | UI ou SMTP podem expor conteudo de e-mails de teste.            | Portas publicadas somente em `127.0.0.1:43150` e `127.0.0.1:43151`.        |
| Denial of service      | Caixa local pode crescer ou portas podem conflitar.             | `MP_MAX_MESSAGES=500` e portas nao comuns validadas.                       |
| Elevation of privilege | Processo poderia rodar com privilegios excessivos no container. | Servico configurado com usuario nao-root `65534:65534` e sem volume local. |

## Abuse cases

- Mapear `1025:1025` ou `8025:8025` no host: bloqueado por validador e
  restricoes ativas.
- Expor SMTP ou UI em `0.0.0.0`: bloqueado por validacao de bind em loopback.
- Configurar relay externo: fora de escopo e proibido nas restricoes ativas.
- Persistir caixa de mensagens em volume: fora de escopo nesta tarefa.
- Usar e-mails reais, dados pessoais reais ou tokens reais em testes: proibido
  por documentacao e restricoes ativas.
- Usar `container_name`: bloqueado por `tools/check-compose.mjs`.

## Riscos residuais

- A UI local nao tem autenticacao e nao pode ser exposta fora de loopback.
- Desenvolvedores ainda podem inserir dados reais manualmente em ambiente local.
- E-mails capturados podem conter tokens de teste; a caixa efemera reduz, mas
  nao elimina, o risco operacional.
- Integracao das aplicacoes com SMTP local fica para tarefas futuras.
