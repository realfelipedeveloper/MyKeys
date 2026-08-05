import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { mykeysApps } from "./mykeys-apps.mjs";

const appName = process.argv[2];
const app = mykeysApps.find((candidate) => candidate.name === appName);

assert.ok(app, `unknown app: ${appName}`);

const config = JSON.parse(await readFile(`apps/${app.name}/app.config.json`, "utf8"));
assert.deepEqual(config, app, `${app.name} config must match registry`);

const outputPath = `dist/apps/${app.name}`;
await mkdir(outputPath, { recursive: true });
await writeFile(
  `${outputPath}/manifest.json`,
  `${JSON.stringify(
    {
      ...app,
      builtAt: new Date(0).toISOString(),
      sourceRoot: `apps/${app.name}/src`,
    },
    null,
    2,
  )}\n`,
);

console.log(`Built ${app.name} application shell.`);
