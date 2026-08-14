# Mailpit local

## Objetivo

Registrar o servico Mailpit local criado na `TASK-008` da SPEC-001.

## Servico

O Compose define o servico:

```yaml
mailpit:
  image: ${MYKEYS_MAILPIT_IMAGE:-axllent/mailpit:v1.30.7}
```

Ele pertence ao namespace `mykeys`, usa a rede privada `mykeys_private`, roda
como usuario `65534:65534` e nao define `container_name`.

## Portas

O SMTP local e exposto apenas em loopback:

```text
127.0.0.1:${MYKEYS_MAIL_SMTP_PORT:-43150}:1025
```

A UI local e exposta apenas em loopback:

```text
127.0.0.1:${MYKEYS_MAIL_UI_PORT:-43151}:8025
```

As portas internas `1025` e `8025` permanecem somente dentro do container. As
portas do host continuam sendo `43150` e `43151`, conforme a SPEC-001.

## Dados

Mailpit permanece efemero na `TASK-008` e nao recebe volume persistente. Essa
decisao reduz risco de reter e-mails de teste com dados pessoais, links de
acesso, tokens ou conteudo sensivel.

## Limite local

O ambiente local usa:

```dotenv
MYKEYS_MAILPIT_MAX_MESSAGES=500
```

Esse limite evita crescimento indefinido da caixa local sem introduzir secrets.

## Healthcheck

O healthcheck usa o endpoint HTTP de readiness do Mailpit:

```text
wget --spider -q http://127.0.0.1:8025/readyz
```

## Fora de escopo

- relay externo;
- envio real de e-mails;
- templates de notificacao;
- integracao dos apps com SMTP;
- persistencia de mensagens;
- autenticacao da UI;
- POP3;
- dados reais.
