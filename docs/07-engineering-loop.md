# Engineering Loop

## Loop obrigatório

### 1. LOAD CONTEXT

Ler:

- constituição;
- AGENTS.md;
- spec ativa;
- ADRs relevantes;
- known regressions;
- contratos;
- design system, quando houver UI.

### 2. VALIDATE SPEC

Confirmar:

- objetivo;
- escopo;
- fora de escopo;
- critérios de aceite;
- riscos;
- dependências;
- rollback.

### 3. IMPACT ANALYSIS

Identificar:

- serviços;
- módulos;
- banco;
- cache;
- filas;
- contratos;
- UI;
- segurança;
- observabilidade.

### 4. THREAT MODEL

Atualizar STRIDE e abuse cases.

### 5. TEST FIRST

Criar ou atualizar testes antes da implementação para comportamento crítico.

### 6. IMPLEMENT MINIMAL CHANGE

Implementar a menor mudança correta e completa.

### 7. LOCAL VALIDATION

- lint
- format
- typecheck
- unit
- integration

### 8. REGRESSION

Executar suíte cumulativa e testes das áreas afetadas.

### 9. SECURITY

- SAST
- SCA
- secret scan
- ZAP quando aplicável
- container scan quando aplicável

### 10. REVIEW DIFF

Verificar:

- escopo;
- código morto;
- duplicação;
- logs sensíveis;
- contrato;
- migration;
- compatibilidade.

### 11. UPDATE MEMORY

Atualizar documentação e contexto persistente.

### 12. COMPLETION REPORT

Relatar:

- arquivos alterados;
- decisões;
- testes;
- riscos;
- resultados;
- rollback;
- itens fora do escopo.

## Falha de gate

Qualquer gate falho reinicia o loop no ponto impactado. Testes não podem ser removidos apenas para liberar o pipeline.
