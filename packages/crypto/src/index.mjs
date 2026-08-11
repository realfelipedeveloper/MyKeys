export const packageManifest = Object.freeze({
  name: "crypto",
  packageName: "@mykeys/crypto",
  kind: "cryptography",
  status: "shell",
  description: "Pacote reservado para criptografia cliente-side do MyKeys.",
});

export function describePackage() {
  return { ...packageManifest };
}
