# Threat model - TASK-009

## Escopo

Adicao do MinIO local ao Docker Compose do MyKeys.

Nao ha buckets de dominio, anexos reais, SDK S3, lifecycle, versionamento de
objetos, KMS, TLS, IAM customizado, bucket bootstrap, replicacao ou integracao
das aplicacoes nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                              | Mitigacao                                                               |
| ---------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Spoofing               | Aplicacoes podem apontar para object storage fora do namespace. | Servico, rede, volume e labels usam namespace `mykeys`; sem integracao. |
| Tampering              | Objetos locais podem ser alterados diretamente no volume.       | Volume local apenas para desenvolvimento, sem dados reais.              |
| Repudiation            | Operacoes na Console local nao possuem trilha de auditoria.     | Fora de escopo; MinIO e infraestrutura local.                           |
| Information disclosure | API ou Console podem expor objetos locais.                      | Portas publicadas somente em `127.0.0.1:43160` e `127.0.0.1:43161`.     |
| Denial of service      | Volume local pode crescer ou portas podem conflitar.            | Porta nao comum validada e volume nomeado com namespace MyKeys.         |
| Elevation of privilege | Processo poderia rodar com privilegios excessivos.              | Servico configurado com usuario nao-root `65532:65532`.                 |
| Supply chain           | Imagem oficial Docker arquivada ou tag mutavel pode driftar.    | Imagem Chainguard mantida e pinada por digest imutavel.                 |

## Abuse cases

- Mapear `9000:9000` ou `9001:9001` no host: bloqueado por validador e
  restricoes ativas.
- Expor API ou Console em `0.0.0.0`: bloqueado por validacao de bind em
  loopback.
- Commitar `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` ou credenciais equivalentes:
  bloqueado por restricoes e validador de `.env.example`.
- Trocar digest por `latest`: proibido por ADR e validadores.
- Usar anexos reais, arquivos reais, dados pessoais reais ou tokens reais:
  proibido pelas restricoes do projeto.
- Usar `container_name`: bloqueado por `tools/check-compose.mjs`.

## Riscos residuais

- Credenciais default do MinIO sao aceitaveis apenas em loopback e sem dados
  reais.
- O volume local pode conter dados de teste e deve ser removido apenas com
  decisao explicita.
- A imagem usada vem de fornecedor alternativo; deve ser reavaliada antes de
  qualquer ambiente remoto ou distribuicao comercial.
- Politicas de bucket, TLS, IAM, KMS e integracao das aplicacoes permanecem fora
  desta tarefa.
