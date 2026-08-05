# ADR-001 - Nx and pnpm workspace baseline

## Status

Accepted

## Contexto

SPEC-001 requires an executable monorepo foundation using Nx and pnpm before
business features are implemented. The current repository started as SDD
documentation, so TASK-001 must add workspace metadata without creating apps,
domain packages, or product behavior that belong to later tasks.

The local toolchain has Node.js available and pnpm is activated through
Corepack. Host ports reserved by SPEC-001 were checked and are free.

## Decisão

Use `pnpm@11.20.0` pinned through `packageManager` and `nx@23.1.1` pinned as a
dev dependency. Configure Nx with `apps/` and `packages/` workspace layout and
cacheable defaults for `build`, `lint`, `test`, and `typecheck`.

Use pnpm supply-chain settings in `pnpm-workspace.yaml`:

- approve the `nx` build script explicitly with `allowBuilds`;
- override `brace-expansion` to `5.0.9` to avoid the known high advisory in
  `5.0.8`.

## Alternativas

- Generate a full workspace with `create-nx-workspace`: rejected for TASK-001
  because it would introduce app/tooling decisions assigned to later tasks.
- Use npm or yarn: rejected because SPEC-001 explicitly requires pnpm.

## Consequências positivas

- The repository now has a deterministic package manager and lockfile.
- Nx is available locally and can discover future apps/packages.
- Supply-chain build execution is explicit instead of interactive.

## Consequências negativas

- Until later tasks add projects, the formal scripts run a workspace foundation
  check instead of real lint/typecheck/unit/build targets.

## Riscos

- Future Nx upgrades may remove the need for the `brace-expansion` override.
- Future pnpm versions may change workspace-level supply-chain settings again.

## Referências

- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/tasks.md`
- `docs/08-quality-gates.md`
- `docs/09-security-gates.md`
