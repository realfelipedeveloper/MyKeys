import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mykeysApps } from "./mykeys-apps.mjs";

const args = process.argv.slice(2);
const selectedApp = args.find((arg) => !arg.startsWith("--"));
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const shouldRunLint = flags.has("--lint");
const shouldRunTypecheck = flags.has("--typecheck") || flags.has("--test");
const shouldRunStartupSmoke = flags.has("--test") || flags.has("--startup");
const apps = selectedApp ? mykeysApps.filter((app) => app.name === selectedApp) : mykeysApps;

assert.ok(apps.length > 0, `unknown app: ${selectedApp}`);

for (const app of apps) {
  await validateApp(app);
}

console.log(`MyKeys app checks passed for ${apps.map((app) => app.name).join(", ")}.`);

async function validateApp(app) {
  const basePath = `apps/${app.name}`;
  const configPath = `${basePath}/app.config.json`;
  const projectPath = `${basePath}/project.json`;
  const mainPath = `${basePath}/src/main.ts`;
  const tsconfigPath = `${basePath}/tsconfig.app.json`;

  await assertExists(configPath);
  await assertExists(projectPath);
  await assertExists(mainPath);
  await assertExists(tsconfigPath);

  const config = await readJson(configPath);
  const project = await readJson(projectPath);

  assert.deepEqual(config, app, `${app.name} config must match registry`);
  assert.equal(project.name, app.name);
  assert.equal(project.projectType, "application");
  assert.equal(project.sourceRoot, `${basePath}/src`);

  for (const targetName of ["serve", "build", "lint", "typecheck", "test"]) {
    assert.equal(
      project.targets?.[targetName]?.executor,
      "nx:run-commands",
      `${app.name}.${targetName} must use nx:run-commands`,
    );
  }

  const source = await readFile(mainPath, "utf8");
  assert.match(source, new RegExp(`name: "${app.name}"`));
  assert.match(source, /runtimeEntrypoint: "tools\/app-runtime\.mjs"/);
  assert.doesNotMatch(source, /master password|plaintext|private key/i);

  if (shouldRunLint) {
    runPnpm(["exec", "eslint", basePath], `${app.name} lint failed`);
  }

  if (shouldRunTypecheck) {
    runPnpm(["exec", "tsc", "--noEmit", "-p", tsconfigPath], `${app.name} typecheck failed`);
  }

  if (shouldRunStartupSmoke) {
    runPnpm(["exec", "tsc", "-p", tsconfigPath], `${app.name} TypeScript emit failed`);
    const bootstrap = await importBuiltApp(app);

    assert.equal(bootstrap.appBootstrap.name, app.name);
    assert.equal(bootstrap.appBootstrap.configPath, configPath);
    assert.equal(bootstrap.appBootstrap.runtimeEntrypoint, "tools/app-runtime.mjs");
  }

  const payload =
    shouldRunStartupSmoke && app.runtime === "http"
      ? await runHttpStartupSmoke(app)
      : runProcessStartupCheck(app);

  assert.equal(payload.app, app.name);
  assert.equal(payload.kind, app.kind);
  assert.equal(payload.runtime, app.runtime);
  assert.equal(payload.status, "ready");
}

async function assertExists(path) {
  await access(path);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function importBuiltApp(app) {
  const builtPath = resolve(`dist/apps/${app.name}/main.js`);
  await assertExists(builtPath);
  return import(pathToFileURL(builtPath).href);
}

function runProcessStartupCheck(app) {
  const smoke = runNode(
    ["tools/app-runtime.mjs", app.name, "--check"],
    `${app.name} startup check failed`,
  );
  return JSON.parse(smoke.stdout.trim());
}

async function runHttpStartupSmoke(app) {
  const child = spawn(process.execPath, ["tools/app-runtime.mjs", app.name], {
    env: {
      ...process.env,
      [app.portEnv]: String(app.defaultPort),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  try {
    return await waitForJsonResponse(
      `http://127.0.0.1:${app.defaultPort}/`,
      () => child.exitCode,
      () => stdout,
      () => stderr,
    );
  } finally {
    child.kill("SIGTERM");
    await waitForExit(child);
  }
}

function runNode(args, message) {
  const result = spawnSync(process.execPath, args, {
    encoding: "utf8",
    stdio: "pipe",
  });

  assert.equal(
    result.status,
    0,
    `${message}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return result;
}

function runPnpm(args, message) {
  const commandLine = ["pnpm", ...args].map(toSafeShellArgument).join(" ");
  const result = spawnSync(commandLine, {
    encoding: "utf8",
    stdio: "pipe",
    shell: true,
  });

  assert.equal(
    result.status,
    0,
    `${message}\nerror:\n${result.error?.message ?? ""}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return result;
}

function toSafeShellArgument(argument) {
  assert.doesNotMatch(argument, /[\s"'`$&|;<>()]/u, `unsafe shell argument: ${argument}`);
  return argument;
}

async function waitForJsonResponse(url, exitCode, stdout, stderr) {
  const deadline = Date.now() + 5_000;

  while (Date.now() < deadline) {
    assert.equal(
      exitCode(),
      null,
      `startup process exited early\nstdout:\n${stdout()}\nstderr:\n${stderr()}`,
    );

    try {
      const response = await fetch(url);
      assert.equal(response.status, 200);
      return await response.json();
    } catch {
      await sleep(100);
    }
  }

  throw new Error(`startup smoke timed out for ${url}\nstdout:\n${stdout()}\nstderr:\n${stderr()}`);
}

async function waitForExit(child) {
  if (child.exitCode !== null) {
    return;
  }

  await Promise.race([
    new Promise((resolvePromise) => child.once("exit", resolvePromise)),
    sleep(1_000),
  ]);
}

async function sleep(ms) {
  await new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}
