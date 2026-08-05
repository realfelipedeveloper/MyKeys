import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { mykeysAppNames } from "./mykeys-apps.mjs";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const packageJson = await readJson("package.json");
const nxJson = await readJson("nx.json");
const workspaceYaml = await readFile("pnpm-workspace.yaml", "utf8");

assert.equal(packageJson.private, true, "workspace package must stay private");
assert.equal(
  packageJson.packageManager,
  "pnpm@11.20.0",
  "workspace must pin pnpm through packageManager",
);
assert.equal(
  packageJson.devDependencies?.nx,
  "23.1.1",
  "workspace must pin the Nx dependency",
);

assert.equal(nxJson.workspaceLayout?.appsDir, "apps");
assert.equal(nxJson.workspaceLayout?.libsDir, "packages");
assert.ok(nxJson.targetDefaults?.build?.cache, "build target must be cacheable");
assert.ok(nxJson.targetDefaults?.lint?.cache, "lint target must be cacheable");
assert.ok(nxJson.targetDefaults?.test?.cache, "test target must be cacheable");
assert.ok(
  nxJson.targetDefaults?.typecheck?.cache,
  "typecheck target must be cacheable",
);
assert.ok(
  nxJson.namedInputs?.sharedGlobals?.includes("{workspaceRoot}/tools/**/*.mjs"),
  "workspace tools must invalidate Nx cache",
);

assert.match(workspaceYaml, /apps\/\*/);
assert.match(workspaceYaml, /packages\/\*/);

for (const appName of mykeysAppNames) {
  const projectPath = `apps/${appName}/project.json`;
  const mainPath = `apps/${appName}/src/main.mjs`;

  assert.ok(await exists(projectPath), `${projectPath} must exist`);
  assert.ok(await exists(mainPath), `${mainPath} must exist`);

  const projectJson = await readJson(projectPath);

  assert.equal(projectJson.name, appName);
  assert.equal(projectJson.projectType, "application");
  assert.equal(projectJson.sourceRoot, `apps/${appName}/src`);
  assert.ok(projectJson.targets?.serve, `${appName} must define serve target`);
  assert.ok(projectJson.targets?.build, `${appName} must define build target`);
  assert.ok(projectJson.targets?.lint, `${appName} must define lint target`);
  assert.ok(
    projectJson.targets?.typecheck,
    `${appName} must define typecheck target`,
  );
  assert.ok(projectJson.targets?.test, `${appName} must define test target`);
}

console.log("MyKeys Nx/pnpm workspace foundation is valid.");
