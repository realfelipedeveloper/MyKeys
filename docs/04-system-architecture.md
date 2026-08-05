# Arquitetura do Sistema

## Serviços iniciais

### web

- Next.js
- React
- Tailwind CSS
- criptografia e descriptografia do cofre
- portal do usuário
- portal administrativo
- planos, billing e notificações

### core-api

- identidade
- autenticação
- tenants
- cofres
- itens criptografados
- dispositivos
- sessões
- compartilhamentos
- entitlements
- feature flags
- auditoria

### payment-api

- gateway fake independente
- crédito
- débito
- Pix
- tokenização fake
- pagamentos
- reembolsos
- chargebacks
- assinaturas
- invoices
- webhooks assinados

### notification-api

- templates
- preferências
- consentimentos
- criação e consulta de notificações
- callbacks
- histórico de entregas

### worker

- outbox
- billing jobs
- retries
- reconciliação
- expiração
- limpeza

### notification-worker

- email
- WhatsApp
- SMS
- in-app
- retries
- DLQ
- fallback por canal

### docs

- arquitetura
- APIs
- produto
- changelog
- runbooks

## Bancos

- `mykeys_core`
- `mykeys_payments`
- `mykeys_notifications`

Podem residir no mesmo PostgreSQL local, mas não compartilham tabelas.

## Redis

Usos:

- cache
- rate limiting
- filas
- idempotência
- locks
- deduplicação
- sessões revogáveis
- entitlements
- feature flags

Proibido:

- plaintext de cofres;
- chaves descriptografadas;
- recovery keys;
- CVV;
- tokens sensíveis.

## Comunicação

- REST para comandos imediatos;
- eventos assíncronos para mudanças de estado;
- outbox para confiabilidade;
- correlation ID;
- causation ID;
- request ID;
- trace ID.

## Multi-tenancy

- banco compartilhado e schema compartilhado inicialmente;
- `tenant_id` obrigatório;
- repositories tenant-aware;
- validação cross-tenant;
- RLS preparado;
- banco ou schema dedicado no futuro para Enterprise.
