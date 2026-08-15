# Restrições Ativas

- Não usar portas 3000, 3001, 5432, 6379 ou 8080 no host.
- Não usar segredos reais.
- Não implementar cloud.
- Não implementar regras de negócio fora da SPEC-001.
- Não usar Tailwind fora dos tokens do Design System.
- Não adicionar dependências sem justificativa.
- Não alterar testes para mascarar falhas.
- PostgreSQL local deve permanecer em `127.0.0.1:${MYKEYS_POSTGRES_PORT}` e nao
  deve usar a porta host `5432`.
- `MYKEYS_POSTGRES_AUTH_METHOD=trust` e permitido apenas para desenvolvimento
  local, sem dados reais e sem ambientes remotos.
- Redis local deve permanecer em `127.0.0.1:${MYKEYS_REDIS_PORT}` e nao deve
  usar a porta host `6379`.
- Redis nao deve armazenar segredos descriptografados, senha-mestra, chaves,
  recovery keys, CVV ou tokens sensiveis.
- Labels Docker devem usar o prefixo `io.github.realfelipedeveloper` e nao
  podem conter referencias legadas a organizacoes externas.
- Mailpit local deve permanecer em
  `127.0.0.1:${MYKEYS_MAIL_SMTP_PORT}` e
  `127.0.0.1:${MYKEYS_MAIL_UI_PORT}`, sem usar as portas host `1025` ou
  `8025`.
- Mailpit nao deve persistir caixa de e-mail nem configurar relay externo na
  `TASK-008`.
- Mailpit nao deve receber e-mails reais, dados pessoais reais ou tokens reais.
- MinIO local deve permanecer em `127.0.0.1:${MYKEYS_MINIO_PORT}` e
  `127.0.0.1:${MYKEYS_MINIO_CONSOLE_PORT}`, sem usar as portas host `9000` ou
  `9001`.
- MinIO deve usar imagem pinada por digest e nao deve usar `latest` ou tag
  mutavel no Compose.
- MinIO nao deve receber arquivos reais, anexos reais, segredos
  descriptografados, recovery keys, CVV ou tokens sensiveis.
- `.env.example` nao deve conter `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` ou
  credenciais equivalentes.
- Mensagens de commit devem ser escritas sempre em português.
- Fluxo Git obrigatório: `feature/*` -> `development` -> `homologation` ->
  `main`.
- Não abrir PR de feature diretamente para `main`.
- Textos de pull request e merge devem ser enviados sempre em português, com
  resumo, validações, impacto e riscos quando aplicável.
- Para cada tarefa, enviar texto de PR e texto de merge para cada etapa:
  `feature/*` -> `development`, `development` -> `homologation` e
  `homologation` -> `main`.
- Após merge em `development` ou `homologation`, abrir automaticamente o PR da
  próxima promoção sem executar merge automático.
- Após push em `feature/*`, abrir automaticamente PR para `development` sem
  executar merge automático.
- A automação de promoção não deve abrir PR quando a comparação entre origem e
  destino não tiver arquivos alterados, mesmo que haja commits de merge à
  frente.
