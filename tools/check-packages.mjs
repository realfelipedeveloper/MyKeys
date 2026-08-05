import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mykeysPackages } from "./mykeys-packages.mjs";

const args = process.argv.slice(2);
const selectedPackage = args.find((arg) => !arg.startsWith("--"));
const packages = selectedPackage
  ? mykeysPackages.filter((pkg) => pkg.name === selectedPackage)
  : mykeysPackages;

assert.ok(packages.length > 0, `unknown package: ${selectedPackage}`);

for (const pkg of packages) {
  await validatePackage(pkg);
}

console.log(
  `MyKeys package checks passed for ${packages.map((pkg) => pkg.name).join(", ")}.`,
);

async function validatePackage(pkg) {
  const basePath = `packages/${pkg.name}`;
  const packageJsonPath = `${basePath}/package.json`;
  const configPath = `${basePath}/package.config.json`;
  const projectPath = `${basePath}/project.json`;
  const sourcePath = `${basePath}/src/index.mjs`;
  const readmePath = `${basePath}/README.md`;

  await assertExists(packageJsonPath);
  await assertExists(configPath);
  await assertExists(projectPath);
  await assertExists(sourcePath);
  await assertExists(readmePath);

  const packageJson = await readJson(packageJsonPath);
  const config = await readJson(configPath);
  const project = await readJson(projectPath);

  assert.deepEqual(config, pkg, `${pkg.name} config must match registry`);
  assert.equal(packageJson.name, pkg.packageName);
  assert.equal(packageJson.version, "0.0.0");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.sideEffects, false);
  assert.equal(packageJson.exports, "./src/index.mjs");
  assert.deepEqual(packageJson.dependencies ?? {}, {});

  assert.equal(project.name, pkg.name);
  assert.equal(project.projectType, "library");
  assert.equal(project.sourceRoot, `${basePath}/src`);

  for (const targetName of ["build", "lint", "typecheck", "test"]) {
    assert.equal(
      project.targets?.[targetName]?.executor,
      "nx:run-commands",
      `${pkg.name}.${targetName} must use nx:run-commands`,
    );
  }

  runNode(["--check", sourcePath], `${pkg.name} syntax check failed`);

  const module = await import(pathToFileURL(resolve(sourcePath)).href);
  assert.deepEqual(
    module.packageManifest,
    pkg,
    `${pkg.name} packageManifest must match registry`,
  );
  assert.deepEqual(
    module.describePackage(),
    pkg,
    `${pkg.name} describePackage must return package metadata`,
  );

  const source = await readFile(sourcePath, "utf8");
  assert.doesNotMatch(source, /master password|plaintext|private key/i);
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
