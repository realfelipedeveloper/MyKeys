import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function loadAppConfig(appName) {
  const path = resolve(workspaceRoot, "apps", appName, "app.config.json");
  return JSON.parse(await readFile(path, "utf8"));
}

export async function startApp(appName, args = process.argv.slice(3)) {
  const config = await loadAppConfig(appName);
  const payload = {
    app: config.name,
    kind: config.kind,
    runtime: config.runtime,
    status: "ready",
  };

  if (args.includes("--check")) {
    console.log(JSON.stringify(payload));
    return;
  }

  if (config.runtime === "http") {
    const port = readPort(config);
    const server = createServer((request, response) => {
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          ...payload,
          path: request.url,
        }),
      );
    });

    server.listen(port, "127.0.0.1", () => {
      console.log(
        JSON.stringify({
          event: "app_started",
          ...payload,
          port,
          portEnv: config.portEnv,
        }),
      );
    });

    registerShutdown(() => server.close());
    return;
  }

  console.log(
    JSON.stringify({
      event: "app_started",
      ...payload,
    }),
  );
  registerShutdown(() => undefined);
  setInterval(() => undefined, 60_000);
}

function readPort(config) {
  const rawPort = process.env[config.portEnv] ?? String(config.defaultPort);
  const port = Number.parseInt(rawPort, 10);

  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`${config.portEnv} must be a TCP port between 1024 and 65535`);
  }

  return port;
}

function registerShutdown(cleanup) {
  const shutdown = () => {
    cleanup();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

const isDirectRun =
  typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const [appName, ...args] = process.argv.slice(2);

  if (!appName) {
    throw new Error("app name is required");
  }

  await startApp(appName, args);
}
