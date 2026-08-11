export const packageManifest = Object.freeze({
  name: "config",
  packageName: "@mykeys/config",
  kind: "configuration",
  status: "shell",
  description: "Pacote compartilhado para configuracao sem segredos reais.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
