# Security Gates

## Baseline

- OWASP ASVS Level 2
- Level 3 para criptografia e autenticação
- OWASP API Security
- STRIDE
- abuse cases

## Pipeline

- secret scanning;
- SAST;
- SCA;
- SBOM;
- license scanning;
- container scanning;
- IaC scanning quando houver;
- DAST;
- ZAP baseline;
- dependency pinning;
- provenance de build.

## Testes de segurança

- XSS;
- CSRF;
- SQL injection;
- NoSQL injection quando aplicável;
- SSRF;
- IDOR;
- mass assignment;
- auth bypass;
- session fixation;
- refresh reuse;
- replay;
- webhook forgery;
- cross-tenant access;
- cache poisoning;
- rate-limit bypass;
- template injection;
- SMS/WhatsApp bombing;
- log leakage.

## Operações críticas

Exigem step-up authentication:

- troca de senha-mestra;
- recovery key;
- exportação;
- exclusão;
- mudança de MFA;
- mudança de contato;
- transferência de organização;
- alterações administrativas sensíveis.

## Produção futura

Antes de venda pública:

- pentest independente;
- revisão criptográfica;
- revisão LGPD;
- restore de backup testado;
- tabletop de incidente;
- revisão de infraestrutura.
