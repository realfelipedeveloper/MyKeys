# ADR-010 - MinIO local via Docker Compose

## Status

Accepted

## Contexto

A `TASK-009` da SPEC-001 exige adicionar MinIO a infraestrutura local. O
Compose ja possui PostgreSQL, Redis e Mailpit com namespace MyKeys, portas nao
comuns, bind em loopback, healthchecks e labels de propriedade do repositorio.

MinIO sera usado apenas como object storage local de desenvolvimento. A tarefa
nao deve implementar anexos, upload real, buckets de dominio, lifecycle,
replicacao, KMS, encrypt-at-rest, IAM customizado, politicas S3 ou integracao
das aplicacoes.

Em 14 de agosto de 2026, a imagem oficial `minio/minio` no Docker Hub aparece
arquivada e atualizada pela ultima vez cerca de 11 meses antes. A release
upstream `RELEASE.2025-10-15T17-29-55Z` corrigiu CVE e orienta construir a
imagem de container a partir do source, mas nao possui manifest publico no
Docker Hub. Para nao introduzir uma imagem congelada com manutencao
interrompida, a decisao local usa a imagem MinIO mantida pela Chainguard,
pinada por digest.

## Decisao

Adicionar o servico `minio` ao `compose.yaml` com:

- imagem
  `cgr.dev/chainguard/minio@sha256:4c94e754559e9fb91cefe103a056d63582b5892de612b647d8e1b0751af5067e`;
- runtime MinIO `RELEASE.2026-07-17T12-07-51Z`;
- bind da API S3 em `127.0.0.1:${MYKEYS_MINIO_PORT:-43160}:9000`;
- bind da Console em
  `127.0.0.1:${MYKEYS_MINIO_CONSOLE_PORT:-43161}:9001`;
- comando `server /data --address :9000 --console-address :9001`;
- volume nomeado `mykeys_minio_data` montado em `/data`;
- healthcheck HTTP em `/minio/health/ready`;
- usuario nao-root `65532:65532`;
- rede privada `mykeys_private`;
- labels do namespace MyKeys com prefixo `io.github.realfelipedeveloper`;
- sem `container_name`;
- sem secrets de root credentials no `.env.example`.

Atualizar validadores, README, runbook, arquitetura, threat model, memoria
persistente e relatorio de conclusao para cobrir MinIO.

## Alternativas

- Usar `minio/minio:RELEASE.2025-09-07T16-13-09Z`: rejeitado por ser imagem
  oficial arquivada e anterior a release de seguranca de outubro de 2025.
- Usar `minio/minio:latest`: rejeitado por drift e por apontar para registry
  arquivada.
- Usar `quay.io/minio/aistor/minio`: rejeitado porque AIStor possui licenca e
  modelo comercial proprios, fora da fundacao local desta SPEC.
- Criar imagem local a partir do source nesta tarefa: rejeitado por aumentar o
  escopo, complexidade de supply chain e tempo de build antes da `TASK-014`.
- Commitar `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD` em `.env.example`:
  rejeitado para nao versionar credenciais nem placeholders sensiveis.

## Consequencias positivas

- Object storage local passa a existir no namespace MyKeys.
- API e Console usam portas oficiais nao comuns da SPEC-001.
- A imagem fica pinada por digest imutavel.
- O processo roda como usuario nao-root.
- O volume nomeado preserva objetos locais de desenvolvimento.
- Healthcheck prepara a base para a futura `TASK-011`.

## Consequencias negativas

- O ambiente local usa credenciais default do MinIO, aceitaveis apenas por
  estar restrito a loopback e sem dados reais.
- A imagem vem de fornecedor alternativo mantido pela Chainguard, nao da
  registry oficial arquivada.
- O volume local pode acumular objetos de desenvolvimento e deve ser limpo com
  cuidado.
- Ainda nao ha bucket bootstrap, SDK, IAM, KMS ou integracao das aplicacoes.

## Riscos

- Expor API ou Console fora de loopback permitiria acesso indevido.
- Usar dados reais, anexos reais ou tokens no MinIO local violaria as
  restricoes do projeto.
- Trocar o digest por tag mutavel reintroduziria drift de supply chain.
- Credenciais default nao podem ser usadas fora do ambiente local.

## Referencias

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0005-docker-compose-namespace-mykeys.md`
- `docs/adr/0007-postgresql-local.md`
- `docs/adr/0008-redis-local.md`
- `docs/adr/0009-mailpit-local.md`
- `docs/09-security-gates.md`
- https://hub.docker.com/r/minio/minio
- https://github.com/minio/minio/releases
- https://docs.min.io/aistor/reference/aistor-server/http-endpoints/
- https://www.chainguard.dev/unchained/secure-and-free-minio-chainguard-containers
