export const packageManifest = Object.freeze({
  name: "ui",
  packageName: "@mykeys/ui",
  kind: "design-system",
  status: "shell",
  description: "Pacote compartilhado para o Design System MyKeys.",
});

export function describePackage() {
  return { ...packageManifest };
}
