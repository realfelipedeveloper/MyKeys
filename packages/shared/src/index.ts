export const packageManifest = Object.freeze({
  name: "shared",
  packageName: "@mykeys/shared",
  kind: "shared",
  status: "shell",
  description: "Pacote compartilhado para tipos e utilitarios comuns.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
