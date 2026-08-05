export const packageManifest = Object.freeze({
  name: "testing",
  packageName: "@mykeys/testing",
  kind: "testing",
  status: "shell",
  description: "Pacote compartilhado para utilitarios de testes.",
});

export function describePackage() {
  return { ...packageManifest };
}
