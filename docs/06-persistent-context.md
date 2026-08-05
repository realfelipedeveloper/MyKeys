# Contexto Persistente

## Fonte oficial

O repositório é a memória oficial do projeto.

## Estrutura

- `docs/adr/`
- `docs/architecture/`
- `docs/security/`
- `docs/testing/`
- `docs/product/`
- `docs/runbooks/`
- `specs/active/`
- `specs/completed/`
- `.agents/context.md`
- `.agents/constraints.md`
- `.agents/lessons-learned.md`
- `.agents/known-regressions.md`
- `.agents/active-feature.json`

## Atualização obrigatória

Cada tarefa deve atualizar, conforme aplicável:

- spec;
- ADR;
- contrato;
- testes;
- ameaças;
- riscos;
- lessons learned;
- known regressions;
- changelog;
- documentação de API.

## active-feature.json

Campos mínimos:

```json
{
  "id": "FEATURE-ID",
  "title": "Título",
  "status": "planned",
  "services": [],
  "agents": [],
  "dependencies": [],
  "risks": [],
  "requiredTests": [],
  "requiredDocs": []
}
```

## Regra antirregressão

Nenhuma feature pode alterar comportamento anterior sem:

- requisito explícito;
- ADR quando arquitetural;
- atualização de contrato;
- atualização de testes;
- migration quando necessário;
- changelog.
