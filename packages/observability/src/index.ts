export const packageManifest = Object.freeze({
  name: "observability",
  packageName: "@mykeys/observability",
  kind: "observability",
  status: "shell",
  description: "Pacote compartilhado para observabilidade e logs estruturados.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
