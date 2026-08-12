import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mykeysPackages } from "./mykeys-packages.mjs";

const args = process.argv.slice(2);
const selectedPackage = args.find((arg) => !arg.startsWith("--"));
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const shouldRunLint = flags.has("--lint");
const shouldRunTypecheck = flags.has("--typecheck") || flags.has("--test");
const shouldRunImportSmoke = flags.has("--test") || flags.size === 0;
const packages = selectedPackage
  ? mykeysPackages.filter((pkg) => pkg.name === selectedPackage)
  : mykeysPackages;

assert.ok(packages.length > 0, `unknown package: ${selectedPackage}`);

for (const pkg of packages) {
  await validatePackage(pkg);
}

console.log(`MyKeys package checks passed for ${packages.map((pkg) => pkg.name).join(", ")}.`);

async function validatePackage(pkg) {
  const basePath = `packages/${pkg.name}`;
  const packageJsonPath = `${basePath}/package.json`;
  const configPath = `${basePath}/package.config.json`;
  const projectPath = `${basePath}/project.json`;
  const sourcePath = `${basePath}/src/index.ts`;
  const tsconfigPath = `${basePath}/tsconfig.lib.json`;
  const readmePath = `${basePath}/README.md`;

  await assertExists(packageJsonPath);
  await assertExists(configPath);
  await assertExists(projectPath);
  await assertExists(sourcePath);
  await assertExists(tsconfigPath);
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
  assert.equal(packageJson.exports, "./src/index.ts");
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

  const source = await readFile(sourcePath, "utf8");
  assert.match(source, new RegExp(`packageName: "${pkg.packageName}"`));
  assert.doesNotMatch(source, /master password|plaintext|private key/i);

  if (shouldRunLint) {
    runPnpm(["exec", "eslint", basePath], `${pkg.name} lint failed`);
  }

  if (shouldRunTypecheck) {
    runPnpm(["exec", "tsc", "--noEmit", "-p", tsconfigPath], `${pkg.name} typecheck failed`);
  }

  if (shouldRunImportSmoke) {
    runPnpm(["exec", "tsc", "-p", tsconfigPath], `${pkg.name} TypeScript emit failed`);
    const module = await importBuiltPackage(pkg);

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
  }
}

async function assertExists(path) {
  await access(path);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function importBuiltPackage(pkg) {
  const builtPath = resolve(`dist/packages/${pkg.name}/index.js`);
  await assertExists(builtPath);
  return import(pathToFileURL(builtPath).href);
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
