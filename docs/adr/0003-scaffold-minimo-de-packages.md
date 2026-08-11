# ADR-003 - Scaffold minimo de packages

## Status

Accepted

## Contexto

A SPEC-001 exige os packages compartilhados `ui`, `contracts`, `config`,
`observability`, `testing`, `crypto` e `shared`. A `TASK-003` trata apenas da
criacao desses packages. Implementacoes reais de Design System, contratos,
configuracao, observabilidade, testes e criptografia pertencem a tarefas
posteriores.

## Decisão

Criar cada package como um shell Nx importavel e privado, sem dependencias novas:

- `package.json` com nome `@mykeys/*`, `private: true`, `type: module` e
  `exports`;
- `package.config.json` com metadados controlados;
- `project.json` com targets `build`, `lint`, `typecheck` e `test`;
- `src/index.mjs` exportando apenas metadados do package;
- `README.md` explicando o limite do shell.

Os scripts de validacao em `tools/` garantem que os manifestos nao divergem do
registro central.

## Alternativas

- Usar geradores Nx de bibliotecas TypeScript: adiado para `TASK-004`, quando
  TypeScript strict, lint real e aliases serao configurados.
- Implementar conteudo real dos packages agora: rejeitado para manter a
  separacao das tarefas da SPEC-001.

## Consequências positivas

- O workspace passa a ter todos os packages previstos pela arquitetura.
- Nx descobre e executa targets para apps e packages.
- Nenhuma dependencia nova foi introduzida.
- O package `crypto` existe sem implementar algoritmos antes da arquitetura e
  dos testes criptograficos dedicados.

## Consequências negativas

- Os packages ainda exportam apenas metadados.
- Os targets de lint/typecheck/test ainda sao validacoes estruturais ate as
  tarefas de tooling.

## Riscos

- Tarefas futuras precisam substituir os shells mantendo nomes, imports e
  limites de seguranca.
- O package `crypto` exige revisao reforcada quando receber implementacao real.

## Referências

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/adr/0001-nx-pnpm-workspace.md`
- `docs/adr/0002-scaffold-minimo-de-apps.md`
