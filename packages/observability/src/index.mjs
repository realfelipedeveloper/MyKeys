export const packageManifest = Object.freeze({
  name: "observability",
  packageName: "@mykeys/observability",
  kind: "observability",
  status: "shell",
  description: "Pacote compartilhado para observabilidade e logs estruturados.",
});

export function describePackage() {
  return { ...packageManifest };
}
