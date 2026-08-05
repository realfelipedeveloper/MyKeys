# Quality Gates

## Obrigatórios em toda pull request

- lint;
- format check;
- TypeScript strict;
- unit tests;
- integration tests impactados;
- regression suite;
- build;
- migration validation;
- contract validation;
- dependency review.

## Cobertura

- geral: >= 85%;
- domínio: >= 90%;
- autenticação: >= 90%;
- criptografia: >= 95%;
- autorização e tenant isolation: >= 95%.

Cobertura sozinha não aprova PR.

## E2E críticos

- cadastro;
- login;
- MFA;
- passkey;
- criação e leitura de item;
- troca de senha-mestra;
- recuperação;
- upgrade;
- pagamento;
- inadimplência;
- downgrade para Free;
- reativação;
- notificações;
- logout global.

## Mutation testing

Obrigatório para:

- criptografia;
- autorização;
- feature flags;
- billing state machine;
- idempotência;
- downgrade e reativação.

## Bloqueios

A PR falha se:

- teste anterior falhar;
- contrato quebrar;
- cobertura cair abaixo do limite;
- migration for irreversível sem plano;
- vulnerabilidade alta/crítica não aprovada;
- segredo for detectado;
- plaintext sensível aparecer em artefatos.
