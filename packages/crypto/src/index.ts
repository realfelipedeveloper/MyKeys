export const packageManifest = Object.freeze({
  name: "crypto",
  packageName: "@mykeys/crypto",
  kind: "cryptography",
  status: "shell",
  description: "Pacote reservado para criptografia cliente-side do MyKeys.",
});

export type PackageManifest = typeof packageManifest;

export function describePackage(): PackageManifest {
  return { ...packageManifest };
}
