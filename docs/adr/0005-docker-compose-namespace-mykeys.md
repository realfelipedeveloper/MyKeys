# ADR-005 - Docker Compose com namespace MyKeys

## Status

Accepted

## Contexto

A `TASK-005` da SPEC-001 exige criar a base de Docker Compose com namespace
MyKeys. Os serviços reais de PostgreSQL, Redis, Mailpit e MinIO pertencem as
tarefas `TASK-006` a `TASK-009`, portanto esta tarefa deve preparar o contrato
de infraestrutura local sem subir containers ainda.

## Decisão

Criar `compose.yaml` com:

- `name: ${MYKEYS_COMPOSE_PROJECT_NAME:-mykeys}`;
- `services: {}` enquanto os serviços reais nao forem adicionados;
- rede privada `mykeys_private`, com nome configuravel por
  `MYKEYS_DOCKER_NETWORK`;
- labels de projeto e namespace MyKeys usando o prefixo
  `io.github.realfelipedeveloper`.

Criar `.env.example` com todos os nomes de porta da SPEC-001 usando portas nao
comuns. Adicionar `tools/check-compose.mjs` para validar o arquivo com
`docker compose config --format json`, garantir o namespace esperado e bloquear
uso de `container_name` ou portas comuns no Compose.

## Alternativas

- Criar serviços placeholder: rejeitado para evitar imagens, pulls e containers
  fora do escopo da `TASK-005`.
- Esperar a `TASK-006` para criar o Compose: rejeitado porque a SPEC-001 separa
  explicitamente a criacao do Compose do primeiro serviço real.
- Usar `container_name`: rejeitado porque a SPEC-001 proibe nomes rigidos de
  container e porque isso prejudica isolamento por projeto.

## Consequências positivas

- O namespace local MyKeys fica estabelecido antes dos serviços.
- A propriedade dos recursos Docker fica vinculada a `realfelipedeveloper`.
- As portas oficiais ja ficam documentadas em `.env.example`.
- O gate local valida o Compose sem depender do Docker daemon.
- O Nx invalida cache quando arquivos de infraestrutura local mudam.

## Consequências negativas

- `docker compose up` ainda nao inicia containers nesta tarefa.
- A rede definida no Compose so sera materializada quando os serviços reais
  forem adicionados.

## Riscos

- Tarefas futuras podem introduzir serviços fora do namespace.
- Tarefas futuras podem reintroduzir labels legadas de outra organizacao.
- Tarefas futuras podem mapear portas comuns por engano.
- Configuracoes locais em `.env` podem divergir do exemplo se nao forem
  verificadas.

## Referências

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/09-security-gates.md`
- `docs/adr/0001-nx-pnpm-workspace.md`
