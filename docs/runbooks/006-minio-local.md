# Runbook - MinIO local

## Objetivo

Orientar o uso do MinIO local da `TASK-009`.

## Subir MinIO

```bash
docker compose --env-file .env.example -f compose.yaml up -d minio
```

## Acessar Console

Abra:

```text
http://127.0.0.1:43161
```

Nesta etapa, o ambiente local usa as credenciais default do MinIO. Elas nao
devem ser usadas fora do ambiente local e nao devem receber dados reais.

## Usar API S3 local

Configure clientes locais para:

```text
endpoint: http://127.0.0.1:43160
path-style: true
tls: disabled
```

Dentro da rede Docker, outros containers podem usar:

```text
endpoint: http://minio:9000
```

## Validar saude

```bash
docker compose --env-file .env.example -f compose.yaml ps minio
```

O healthcheck interno chama:

```text
http://127.0.0.1:9000/minio/health/ready
```

Pelo host local:

```bash
curl -I http://127.0.0.1:43160/minio/health/ready
```

## Encerrar

```bash
docker compose --env-file .env.example -f compose.yaml down
```

Nao use `down -v` como rotina. O volume `mykeys_minio_data` preserva objetos
locais de desenvolvimento e deve ser descartado apenas com decisao explicita.

## Cuidados

- Nao enviar arquivos reais para MinIO local.
- Nao usar anexos reais, dados pessoais reais ou tokens reais em objetos de
  teste.
- Nao expor `43160` ou `43161` fora de `127.0.0.1`.
- Nao trocar o digest da imagem por tag mutavel sem nova revisao de
  supply chain.
- Nao versionar credenciais MinIO em `.env.example`.
