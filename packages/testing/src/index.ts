export const packageManifest = Object.freeze({
  name: "testing",
  packageName: "@mykeys/testing",
  kind: "testing",
  status: "shell",
  description: "Pacote compartilhado para utilitarios de testes.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
