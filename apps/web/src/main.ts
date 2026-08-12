export const appBootstrap = {
  name: "web",
  configPath: "apps/web/app.config.json",
  runtimeEntrypoint: "tools/app-runtime.mjs",
} as const;

export type AppBootstrap = typeof appBootstrap;
