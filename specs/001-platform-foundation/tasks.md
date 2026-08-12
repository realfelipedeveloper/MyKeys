# Tarefas — SPEC-001

## EPIC-001 — Bootstrap do monorepo

### TASK-001

Criar workspace Nx com pnpm.

### TASK-002

Criar apps web, docs, core-api, payment-api, notification-api, worker e notification-worker.

### TASK-003

Criar packages compartilhados.

### TASK-004

Configurar TypeScript strict, ESLint, Prettier e path aliases.

## EPIC-002 — Infra local

### TASK-005

Criar Docker Compose com namespace MyKeys.

### TASK-006

Adicionar PostgreSQL.

### TASK-007

Adicionar Redis.

### TASK-008

Adicionar Mailpit.

### TASK-009

Adicionar MinIO.

### TASK-010

Criar script de verificação de portas.

### TASK-011

Adicionar health checks e graceful shutdown.

## EPIC-003 — Qualidade

### TASK-012

Configurar Jest.

### TASK-013

Configurar Testing Library.

### TASK-014

Configurar Testcontainers.

### TASK-015

Configurar Playwright.

### TASK-016

Criar pipeline GitHub Actions.

Observação: antecipada após a `TASK-005` para corrigir a governança do Git Flow
antes da continuidade da infraestrutura local. Também inclui automação para
abrir PRs de promoção entre `development`, `homologation` e `main` após merges.

### TASK-017

Adicionar coverage gates.

## EPIC-004 — UI e marca

### TASK-018

Configurar Tailwind CSS.

### TASK-019

Criar tokens azul-marinho.

### TASK-020

Criar Button, Input, Card, Alert e Modal.

### TASK-021

Adicionar testes e acessibilidade.

### TASK-022

Criar primeira landing do MyKeys.

## EPIC-005 — Documentação e memória

### TASK-023

Criar portal docs.

### TASK-024

Criar ADR template.

### TASK-025

Criar estrutura de memória persistente.

### TASK-026

Criar active-feature.json.

### TASK-027

Criar completion-report template.

## Regra

Cada tarefa deve ser executada separadamente, com branch `feature/spec-001-task-XXX`.
