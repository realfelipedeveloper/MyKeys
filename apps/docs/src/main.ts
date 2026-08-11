export const appBootstrap = {
  name: "docs",
  configPath: "apps/docs/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
