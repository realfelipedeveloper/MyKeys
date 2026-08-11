export const appBootstrap = {
  name: "notification-api",
  configPath: "apps/notification-api/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
