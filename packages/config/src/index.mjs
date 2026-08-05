export const packageManifest = Object.freeze({
  name: "config",
  packageName: "@mykeys/config",
  kind: "configuration",
  status: "shell",
  description: "Pacote compartilhado para configuracao sem segredos reais.",
});

export function describePackage() {
  return { ...packageManifest };
}
