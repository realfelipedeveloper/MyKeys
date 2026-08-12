export const appBootstrap = {
  name: "payment-api",
  configPath: "apps/payment-api/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
