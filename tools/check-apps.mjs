import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import { mykeysApps } from "./mykeys-apps.mjs";

const args = process.argv.slice(2);
const selectedApp = args.find((arg) => !arg.startsWith("--"));
const shouldRunStartupSmoke = args.includes("--test") || args.includes("--startup");
const apps = selectedApp
  ? mykeysApps.filter((app) => app.name === selectedApp)
  : mykeysApps;

assert.ok(apps.length > 0, `unknown app: ${selectedApp}`);

for (const app of apps) {
  await validateApp(app);
}

console.log(`MyKeys app checks passed for ${apps.map((app) => app.name).join(", ")}.`);

async function validateApp(app) {
  const basePath = `apps/${app.name}`;
  const configPath = `${basePath}/app.config.json`;
  const projectPath = `${basePath}/project.json`;
  const mainPath = `${basePath}/src/main.mjs`;

  await assertExists(configPath);
  await assertExists(projectPath);
  await assertExists(mainPath);

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
  assert.match(source, new RegExp(`startApp\\("${app.name}"\\)`));

  runNode(["--check", mainPath], `${app.name} syntax check failed`);
  const payload =
    shouldRunStartupSmoke && app.runtime === "http"
      ? await runHttpStartupSmoke(app, mainPath)
      : runProcessStartupCheck(app, mainPath);

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

function runProcessStartupCheck(app, mainPath) {
  const smoke = runNode([mainPath, "--check"], `${app.name} startup check failed`);
  return JSON.parse(smoke.stdout.trim());
}

async function runHttpStartupSmoke(app, mainPath) {
  const child = spawn(process.execPath, [mainPath], {
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
    new Promise((resolve) => child.once("exit", resolve)),
    sleep(1_000),
  ]);
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
