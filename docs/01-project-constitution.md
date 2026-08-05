# Constituição do Projeto MyKeys

## 1. Missão

Construir um SaaS comercial de gerenciamento de senhas, zero knowledge, seguro, escalável, multi-tenant e preparado para milhões de usuários.

## 2. Princípios

### Segurança antes de conveniência

Nenhuma funcionalidade pode reduzir garantias criptográficas, isolamento entre tenants, proteção de sessões ou rastreabilidade.

### Zero knowledge

O servidor não deve possuir capacidade de descriptografar itens do cofre.

### Preservação de dados

Inadimplência nunca cancela automaticamente a conta e nunca exclui dados. Após o ciclo de cobrança e tolerância, a conta é rebaixada ao plano Free.

### Evolução incremental

A implementação será dividida em épicos, capabilities, features, tarefas e subtarefas pequenas.

### Regressão bloqueada

Uma feature nova não pode quebrar funcionalidades anteriores. Toda correção gera teste de regressão.

### Configuração em vez de pendência

Preços, quotas, prazos e políticas devem ter valores padrão configuráveis. Não deixar decisões indefinidas quando puderem ser representadas por configuração.

### Cloud portability

A solução nasce em localhost, mas usa ports e adapters para futura implantação em VPS, AWS, Google Cloud e Cloudflare.

## 3. Arquitetura

- Monorepo Nx + pnpm
- Web
- Core API
- Payment API
- Notification API
- Worker
- Notification Worker
- Docs
- PostgreSQL por domínio lógico
- Redis + BullMQ
- REST síncrono
- Eventos assíncronos com outbox

## 4. Requisitos de produto

- planos Free, Personal, Family, Business e Enterprise;
- feature flags e entitlements;
- senhas, cartões, identidades, notas e anexos;
- compartilhamento;
- histórico;
- importação e exportação;
- MFA;
- passkeys;
- recovery keys;
- billing fake;
- notificações omnichannel;
- painel administrativo;
- design system;
- documentação integrada.

## 5. Requisitos de inadimplência

- não cancelar automaticamente;
- não apagar dados;
- rebaixar para Free;
- preservar leitura e exportação;
- restringir criação e uso de recursos premium;
- reativar automaticamente após regularização.

## 6. Requisitos de qualidade

- cobertura geral mínima: 85%;
- domínio, criptografia e autenticação: 90% a 95%;
- fluxos críticos cobertos por E2E;
- mutation testing em módulos críticos;
- quality gates bloqueantes.

## 7. Requisitos de segurança

- OWASP ASVS Level 2;
- controles de Level 3 para criptografia e autenticação;
- STRIDE;
- abuse cases;
- SAST;
- DAST;
- SCA;
- SBOM;
- secret scanning;
- container scanning;
- pentest e revisão criptográfica antes de venda pública.
