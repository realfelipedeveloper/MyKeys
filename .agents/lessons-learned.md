# Lições Aprendidas

- 2026-08-05: `pnpm@11.20.0` keeps dependency build-script approvals in
  `pnpm-workspace.yaml`; `nx@23.1.1` requires `allowBuilds.nx: true`.
- 2026-08-05: `nx@23.1.1` pulled `brace-expansion@5.0.8`, which had a high
  advisory. The workspace pins `brace-expansion@5.0.9` through pnpm overrides.
