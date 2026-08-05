export const packageManifest = Object.freeze({
  name: "shared",
  packageName: "@mykeys/shared",
  kind: "shared",
  status: "shell",
  description: "Pacote compartilhado para tipos e utilitarios comuns.",
});

export function describePackage() {
  return { ...packageManifest };
}
