# MinIO local

## Objetivo

Registrar o servico MinIO local criado na `TASK-009` da SPEC-001.

## Servico

O Compose define o servico:

```yaml
minio:
  image: ${MYKEYS_MINIO_IMAGE:-cgr.dev/chainguard/minio@sha256:4c94e754559e9fb91cefe103a056d63582b5892de612b647d8e1b0751af5067e}
```

Ele pertence ao namespace `mykeys`, usa a rede privada `mykeys_private`, roda
como usuario `65532:65532` e nao define `container_name`.

## Portas

A API S3 local e exposta apenas em loopback:

```text
127.0.0.1:${MYKEYS_MINIO_PORT:-43160}:9000
```

A Console local e exposta apenas em loopback:

```text
127.0.0.1:${MYKEYS_MINIO_CONSOLE_PORT:-43161}:9001
```

As portas internas `9000` e `9001` permanecem somente dentro do container. As
portas do host continuam sendo `43160` e `43161`, conforme a SPEC-001.

## Dados

O volume nomeado e:

```text
mykeys_minio_data
```

Ele e montado em `/data` para preservar objetos locais de desenvolvimento entre
reinicios. O volume nao deve receber anexos reais, dados pessoais reais,
segredos descriptografados, recovery keys, CVV ou tokens sensiveis.

## Credenciais locais

Nenhuma credencial MinIO e versionada em `.env.example`. O servidor local usa as
credenciais default do MinIO apenas nesta etapa, com API e Console restritas a
`127.0.0.1`.

Ambientes reais devem substituir isso por secret management, TLS, IAM,
politicas de bucket, KMS e rede privada de ambiente antes de qualquer deploy.

## Healthcheck

O healthcheck usa o endpoint HTTP de readiness:

```text
GET /minio/health/ready HTTP/1.1
Host: 127.0.0.1
Connection: close
```

A imagem usada nao inclui `curl` ou `wget`, portanto o Compose executa `bash`
com `/dev/tcp` para validar que o endpoint retorna `200 OK` com uma requisicao
HTTP valida.

## Fora de escopo

- buckets de dominio;
- anexos reais;
- SDK S3;
- lifecycle policies;
- versionamento de objetos;
- replicacao;
- KMS;
- TLS;
- IAM customizado;
- bucket bootstrap;
- integracao das aplicacoes.
