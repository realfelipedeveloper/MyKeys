# Threat model - TASK-003

## Escopo

Criacao dos shells dos packages compartilhados:

- `ui`;
- `contracts`;
- `config`;
- `observability`;
- `testing`;
- `crypto`;
- `shared`.

Nao ha implementacao real de criptografia, autenticacao, storage, rede, banco,
Redis, filas, contratos publicos ou dados sensiveis nesta tarefa.

## STRIDE

| Categoria              | Risco nesta tarefa                                                  | Mitigacao                                                               |
| ---------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Spoofing               | Packages podem ser referenciados com nomes inconsistentes.          | `package.json`, `package.config.json` e registro central sao validados. |
| Tampering              | Metadados de packages podem divergir.                               | `tools/check-packages.mjs` compara todos os manifestos.                 |
| Repudiation            | Nao ha eventos de negocio ou auditoria.                             | Fora de escopo; observabilidade real entra em tarefas futuras.          |
| Information disclosure | Package de config ou observability poderia expor valores sensiveis. | Shells exportam apenas metadados sem valores de ambiente ou segredos.   |
| Denial of service      | Build de packages poderia deixar artefatos inconsistentes.          | `tools/build-package.mjs` gera manifestos deterministicos em `dist/`.   |
| Elevation of privilege | Packages ainda nao possuem autorizacao ou execucao privilegiada.    | Nenhuma operacao privilegiada foi implementada.                         |

## Abuse cases

- Implementar algoritmo criptografico sem vetores conhecidos: evitado nesta
  tarefa; `@mykeys/crypto` permanece shell.
- Inserir segredos em package de config: mitigado por ausencia de valores reais
  e varredura de termos sensiveis.
- Publicar packages acidentalmente: todos os packages estao com `private: true`.

## Riscos residuais

- `@mykeys/crypto` exigira revisao criptografica quando receber codigo real.
- Contratos publicos exigirao versionamento e testes de compatibilidade nas
  tarefas futuras.
