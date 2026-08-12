import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { mykeysPackages } from "./mykeys-packages.mjs";

const packageName = process.argv[2];
const pkg = mykeysPackages.find((candidate) => candidate.name === packageName);

assert.ok(pkg, `unknown package: ${packageName}`);

const config = JSON.parse(await readFile(`packages/${pkg.name}/package.config.json`, "utf8"));
assert.deepEqual(config, pkg, `${pkg.name} config must match registry`);

const outputPath = `dist/packages/${pkg.name}`;
await access(`${outputPath}/index.js`);
await mkdir(outputPath, { recursive: true });
await writeFile(
  `${outputPath}/manifest.json`,
  `${JSON.stringify(
    {
      ...pkg,
      builtAt: new Date(0).toISOString(),
      sourceRoot: `packages/${pkg.name}/src`,
    },
    null,
    2,
  )}\n`,
);

console.log(`Built ${pkg.name} package shell.`);
