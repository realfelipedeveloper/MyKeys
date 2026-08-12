export const packageManifest = Object.freeze({
  name: "contracts",
  packageName: "@mykeys/contracts",
  kind: "contracts",
  status: "shell",
  description: "Pacote compartilhado para contratos publicos versionados.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
