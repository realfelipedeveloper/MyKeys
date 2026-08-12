# Catálogo de MCPs

## Desde o início

### GitHub MCP

Uso:

- issues;
- pull requests;
- branches;
- checks;
- revisão.

Restrições:

- menor privilégio;
- sem acesso administrativo;
- sem push direto em `development`, `homologation` ou `main`.

### Playwright MCP

Uso:

- E2E;
- acessibilidade;
- fluxos visuais;
- regressão.

Restrições:

- perfil isolado;
- sem contas pessoais;
- apenas ambientes permitidos.

### Context7 MCP

Uso:

- documentação atualizada de bibliotecas.

Restrições:

- não substitui ADRs;
- não é autoridade criptográfica.

### Filesystem MCP restrito

Uso:

- arquivos do workspace.

Restrições:

- apenas repositório MyKeys;
- sem `.ssh`, diretórios pessoais ou outros projetos.

### MyKeys Project Context MCP

Recursos:

- constitution;
- active spec;
- architecture;
- crypto decisions;
- business rules;
- plan catalog;
- quality gates;
- regressions.

### MyKeys Design System MCP

Recursos:

- tokens;
- componentes;
- padrões;
- acessibilidade;
- marca.

## Futuro

- Sentry MCP;
- AWS MCP;
- Google Cloud MCP;
- Cloudflare MCP.

## Proibidos inicialmente

- PostgreSQL com escrita livre;
- Redis com comandos livres;
- Docker administrativo global.

## Governança

Todo MCP precisa de:

- owner;
- versão;
- permissões;
- ambientes;
- operações proibidas;
- timeout;
- logs;
- revogação;
- revisão de segurança.
