export const appBootstrap = {
  name: "notification-worker",
  configPath: "apps/notification-worker/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
