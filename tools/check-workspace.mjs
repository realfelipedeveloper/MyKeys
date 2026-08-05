import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

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

assert.match(workspaceYaml, /apps\/\*/);
assert.match(workspaceYaml, /packages\/\*/);

console.log("MyKeys Nx/pnpm workspace foundation is valid.");
