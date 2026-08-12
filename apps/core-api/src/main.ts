export const appBootstrap = {
  name: "core-api",
  configPath: "apps/core-api/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
