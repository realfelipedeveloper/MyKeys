export const mykeysPackages = [
  {
    name: "ui",
    packageName: "@mykeys/ui",
    kind: "design-system",
    status: "shell",
    description: "Pacote compartilhado para o Design System MyKeys.",
  },
  {
    name: "contracts",
    packageName: "@mykeys/contracts",
    kind: "contracts",
    status: "shell",
    description: "Pacote compartilhado para contratos publicos versionados.",
  },
  {
    name: "config",
    packageName: "@mykeys/config",
    kind: "configuration",
    status: "shell",
    description: "Pacote compartilhado para configuracao sem segredos reais.",
  },
  {
    name: "observability",
    packageName: "@mykeys/observability",
    kind: "observability",
    status: "shell",
    description: "Pacote compartilhado para observabilidade e logs estruturados.",
  },
  {
    name: "testing",
    packageName: "@mykeys/testing",
    kind: "testing",
    status: "shell",
    description: "Pacote compartilhado para utilitarios de testes.",
  },
  {
    name: "crypto",
    packageName: "@mykeys/crypto",
    kind: "cryptography",
    status: "shell",
    description: "Pacote reservado para criptografia cliente-side do MyKeys.",
  },
  {
    name: "shared",
    packageName: "@mykeys/shared",
    kind: "shared",
    status: "shell",
    description: "Pacote compartilhado para tipos e utilitarios comuns.",
  },
];

export const mykeysPackageNames = mykeysPackages.map((pkg) => pkg.name);
