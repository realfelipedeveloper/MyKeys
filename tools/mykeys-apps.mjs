export const mykeysApps = [
  {
    name: "web",
    kind: "frontend",
    runtime: "http",
    portEnv: "MYKEYS_WEB_PORT",
    defaultPort: 43110,
    description: "Portal web inicial do MyKeys.",
  },
  {
    name: "docs",
    kind: "documentation",
    runtime: "process",
    description: "Aplicacao de documentacao inicial do MyKeys.",
  },
  {
    name: "core-api",
    kind: "api",
    runtime: "http",
    portEnv: "MYKEYS_CORE_API_PORT",
    defaultPort: 43120,
    description: "API central inicial do MyKeys.",
  },
  {
    name: "payment-api",
    kind: "api",
    runtime: "http",
    portEnv: "MYKEYS_PAYMENT_API_PORT",
    defaultPort: 43121,
    description: "API de pagamentos fake inicial do MyKeys.",
  },
  {
    name: "notification-api",
    kind: "api",
    runtime: "http",
    portEnv: "MYKEYS_NOTIFICATION_API_PORT",
    defaultPort: 43122,
    description: "API de notificacoes inicial do MyKeys.",
  },
  {
    name: "worker",
    kind: "worker",
    runtime: "process",
    description: "Worker de plataforma inicial do MyKeys.",
  },
  {
    name: "notification-worker",
    kind: "worker",
    runtime: "process",
    description: "Worker de notificacoes inicial do MyKeys.",
  },
];

export const mykeysAppNames = mykeysApps.map((app) => app.name);
