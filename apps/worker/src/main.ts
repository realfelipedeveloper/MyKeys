export const appBootstrap = {
  name: "worker",
  configPath: "apps/worker/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
