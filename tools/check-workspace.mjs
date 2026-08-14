import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { mykeysAppNames } from "./mykeys-apps.mjs";
import { mykeysPackageNames } from "./mykeys-packages.mjs";

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
const tsconfigBase = await readJson("tsconfig.base.json");
const prettierConfig = await readJson(".prettierrc.json");
const workspaceYaml = await readFile("pnpm-workspace.yaml", "utf8");
const prettierIgnore = await readFile(".prettierignore", "utf8");
const composeYaml = await readFile("compose.yaml", "utf8");
const envExample = await readFile(".env.example", "utf8");
const ciWorkflow = await readFile(".github/workflows/ci.yml", "utf8");
const promotionsWorkflow = await readFile(".github/workflows/promotions.yml", "utf8");

const expectedDevDependencies = {
  "@eslint/js": "10.0.1",
  "@types/node": "24.13.3",
  eslint: "10.8.1",
  globals: "17.9.0",
  nx: "23.1.1",
  prettier: "3.9.6",
  typescript: "6.0.3",
  "typescript-eslint": "8.67.0",
};

assert.equal(packageJson.private, true, "workspace package must stay private");
assert.equal(packageJson.type, "module", "workspace must use ESM for emitted JS");
assert.equal(
  packageJson.packageManager,
  "pnpm@11.20.0",
  "workspace must pin pnpm through packageManager",
);

for (const [dependency, version] of Object.entries(expectedDevDependencies)) {
  assert.equal(
    packageJson.devDependencies?.[dependency],
    version,
    `${dependency} must be pinned at ${version}`,
  );
}

assert.match(packageJson.scripts?.["format:check"] ?? "", /prettier --check \./);
assert.match(
  packageJson.scripts?.["check:aliases"] ?? "",
  /tsc --noEmit -p tsconfig\.aliases\.json/,
);
assert.match(packageJson.scripts?.["check:compose"] ?? "", /node tools\/check-compose\.mjs/);
assert.match(packageJson.scripts?.["check:ci"] ?? "", /node tools\/check-ci\.mjs/);
assert.match(packageJson.scripts?.["check:promotions"] ?? "", /node tools\/check-promotions\.mjs/);
assert.match(packageJson.scripts?.lint ?? "", /pnpm format:check/);
assert.match(packageJson.scripts?.lint ?? "", /pnpm check:compose/);
assert.match(packageJson.scripts?.lint ?? "", /pnpm check:ci/);
assert.match(packageJson.scripts?.lint ?? "", /pnpm check:promotions/);
assert.match(packageJson.scripts?.lint ?? "", /pnpm lint:tooling/);

assert.equal(nxJson.workspaceLayout?.appsDir, "apps");
assert.equal(nxJson.workspaceLayout?.libsDir, "packages");
assert.ok(nxJson.targetDefaults?.build?.cache, "build target must be cacheable");
assert.ok(nxJson.targetDefaults?.lint?.cache, "lint target must be cacheable");
assert.ok(nxJson.targetDefaults?.test?.cache, "test target must be cacheable");
assert.ok(nxJson.targetDefaults?.typecheck?.cache, "typecheck target must be cacheable");

for (const sharedGlobal of [
  "{workspaceRoot}/compose.yaml",
  "{workspaceRoot}/.env.example",
  "{workspaceRoot}/.github/workflows/*.yml",
  "{workspaceRoot}/eslint.config.mjs",
  "{workspaceRoot}/tsconfig.base.json",
  "{workspaceRoot}/tsconfig.eslint.json",
  "{workspaceRoot}/tsconfig.aliases.json",
  "{workspaceRoot}/.prettierrc.json",
  "{workspaceRoot}/.prettierignore",
  "{workspaceRoot}/tools/**/*.mjs",
  "{workspaceRoot}/tools/**/*.ts",
]) {
  assert.ok(
    nxJson.namedInputs?.sharedGlobals?.includes(sharedGlobal),
    `${sharedGlobal} must invalidate Nx cache`,
  );
}

assert.match(workspaceYaml, /apps\/\*/);
assert.match(workspaceYaml, /packages\/\*/);
assert.match(workspaceYaml, /allowBuilds:\s+nx: true/s);
assert.match(workspaceYaml, /brace-expansion: 5\.0\.9/);

assert.equal(tsconfigBase.compilerOptions?.strict, true);
assert.equal(tsconfigBase.compilerOptions?.module, "NodeNext");
assert.equal(tsconfigBase.compilerOptions?.moduleResolution, "NodeNext");
assert.equal(tsconfigBase.compilerOptions?.noUncheckedIndexedAccess, true);
assert.equal(tsconfigBase.compilerOptions?.exactOptionalPropertyTypes, true);
assert.equal(prettierConfig.printWidth, 100);
assert.equal(prettierConfig.semi, true);
assert.match(prettierIgnore, /pnpm-lock\.yaml/);
assert.match(composeYaml, /^name:\s+\$\{MYKEYS_COMPOSE_PROJECT_NAME:-mykeys\}/m);
assert.match(composeYaml, /^\s+postgres:\s*$/m);
assert.match(composeYaml, /^\s+redis:\s*$/m);
assert.doesNotMatch(composeYaml, /\bcontainer_name\s*:/);
assert.match(composeYaml, /MYKEYS_DOCKER_NETWORK:-mykeys_private/);
assert.match(composeYaml, /postgres:18-alpine/);
assert.match(composeYaml, /127\.0\.0\.1:\$\{MYKEYS_POSTGRES_PORT:-43130\}:5432/);
assert.match(composeYaml, /PGDATA:\s+\/var\/lib\/postgresql\/18\/docker/);
assert.match(composeYaml, /pg_isready/);
assert.match(composeYaml, /mykeys_postgres_data/);
assert.match(composeYaml, /redis:8\.10-alpine/);
assert.match(composeYaml, /127\.0\.0\.1:\$\{MYKEYS_REDIS_PORT:-43140\}:6379/);
assert.match(composeYaml, /redis-cli/);
assert.match(composeYaml, /--appendonly/);
assert.match(composeYaml, /mykeys_redis_data/);
assert.match(envExample, /^MYKEYS_COMPOSE_PROJECT_NAME=mykeys$/m);
assert.match(envExample, /^MYKEYS_DOCKER_NETWORK=mykeys_private$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_IMAGE=postgres:18-alpine$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_PORT=43130$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_DB=mykeys$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_USER=mykeys$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_AUTH_METHOD=trust$/m);
assert.match(envExample, /^MYKEYS_POSTGRES_DATA_VOLUME=mykeys_postgres_data$/m);
assert.match(envExample, /^MYKEYS_REDIS_IMAGE=redis:8\.10-alpine$/m);
assert.match(envExample, /^MYKEYS_REDIS_PORT=43140$/m);
assert.match(envExample, /^MYKEYS_REDIS_DATA_VOLUME=mykeys_redis_data$/m);
assert.match(ciWorkflow, /pull_request:\s+branches:\s+- development\s+- homologation\s+- main/s);
assert.match(ciWorkflow, /push:\s+branches:\s+- development\s+- homologation\s+- main/s);
assert.match(ciWorkflow, /pnpm install --frozen-lockfile/);
assert.match(ciWorkflow, /pnpm check:promotions/);
assert.match(ciWorkflow, /pnpm audit --audit-level high/);
assert.match(
  promotionsWorkflow,
  /push:\s+branches:\s+- feature\/\*\*\s+- development\s+- homologation/s,
  "promotion workflow must run after feature, development and homologation updates",
);
assert.match(
  promotionsWorkflow,
  /pull-requests: write/,
  "promotion workflow must be allowed to open pull requests",
);
assert.match(
  promotionsWorkflow,
  /actions: write/,
  "promotion workflow must be allowed to trigger CI after opening PRs",
);
assert.match(
  promotionsWorkflow,
  /CHANGED_FILES="\$\(gh api "\$\{COMPARE_ENDPOINT\}" --jq '\.files \| length'\)"/,
  "promotion workflow must inspect changed files before creating PRs",
);
assert.match(
  promotionsWorkflow,
  /"\$AHEAD_BY" == "0" \|\| "\$CHANGED_FILES" == "0"/,
  "promotion workflow must skip promotion PRs without changed files",
);
assert.match(promotionsWorkflow, /gh workflow run "MyKeys CI"/);

for (const packageName of mykeysPackageNames) {
  assert.deepEqual(
    tsconfigBase.compilerOptions?.paths?.[`@mykeys/${packageName}`],
    [`packages/${packageName}/src/index.ts`],
    `@mykeys/${packageName} alias must point at TypeScript source`,
  );
}

assert.ok(await exists("eslint.config.mjs"), "ESLint flat config must exist");
assert.ok(await exists("tsconfig.eslint.json"), "ESLint tsconfig must exist");
assert.ok(await exists("tsconfig.aliases.json"), "alias smoke tsconfig must exist");
assert.ok(await exists("tools/alias-smoke.ts"), "alias smoke source must exist");

for (const appName of mykeysAppNames) {
  const projectPath = `apps/${appName}/project.json`;
  const mainPath = `apps/${appName}/src/main.ts`;
  const tsconfigPath = `apps/${appName}/tsconfig.app.json`;

  assert.ok(await exists(projectPath), `${projectPath} must exist`);
  assert.ok(await exists(mainPath), `${mainPath} must exist`);
  assert.ok(await exists(tsconfigPath), `${tsconfigPath} must exist`);

  const projectJson = await readJson(projectPath);

  assert.equal(projectJson.name, appName);
  assert.equal(projectJson.projectType, "application");
  assert.equal(projectJson.sourceRoot, `apps/${appName}/src`);
  assertCommandIncludes(projectJson, "serve", "node tools/app-runtime.mjs", appName);
  assertCommandIncludes(projectJson, "build", "pnpm exec tsc -p", tsconfigPath);
  assertCommandIncludes(projectJson, "build", "node tools/build-app.mjs", appName);
  assertCommandIncludes(projectJson, "lint", "pnpm exec eslint", `apps/${appName}`);
  assertCommandIncludes(projectJson, "typecheck", "pnpm exec tsc --noEmit -p", tsconfigPath);
  assertCommandIncludes(projectJson, "test", "node tools/check-apps.mjs", appName, "--test");
}

for (const packageName of mykeysPackageNames) {
  const projectPath = `packages/${packageName}/project.json`;
  const packageJsonPath = `packages/${packageName}/package.json`;
  const sourcePath = `packages/${packageName}/src/index.ts`;
  const tsconfigPath = `packages/${packageName}/tsconfig.lib.json`;

  assert.ok(await exists(projectPath), `${projectPath} must exist`);
  assert.ok(await exists(packageJsonPath), `${packageJsonPath} must exist`);
  assert.ok(await exists(sourcePath), `${sourcePath} must exist`);
  assert.ok(await exists(tsconfigPath), `${tsconfigPath} must exist`);

  const projectJson = await readJson(projectPath);
  const packageManifest = await readJson(packageJsonPath);

  assert.equal(packageManifest.exports, "./src/index.ts");
  assert.equal(projectJson.name, packageName);
  assert.equal(projectJson.projectType, "library");
  assert.equal(projectJson.sourceRoot, `packages/${packageName}/src`);
  assertCommandIncludes(projectJson, "build", "pnpm exec tsc -p", tsconfigPath);
  assertCommandIncludes(projectJson, "build", "node tools/build-package.mjs", packageName);
  assertCommandIncludes(projectJson, "lint", "pnpm exec eslint", `packages/${packageName}`);
  assertCommandIncludes(projectJson, "typecheck", "pnpm exec tsc --noEmit -p", tsconfigPath);
  assertCommandIncludes(
    projectJson,
    "test",
    "node tools/check-packages.mjs",
    packageName,
    "--test",
  );
}

console.log("MyKeys Nx/pnpm/TypeScript workspace foundation is valid.");

function assertCommandIncludes(projectJson, targetName, ...fragments) {
  const target = projectJson.targets?.[targetName];

  assert.equal(
    target?.executor,
    "nx:run-commands",
    `${projectJson.name}.${targetName} must use nx:run-commands`,
  );

  const command = target?.options?.command ?? "";

  for (const fragment of fragments) {
    assert.match(
      command,
      new RegExp(escapeRegExp(fragment)),
      `${projectJson.name}.${targetName} must include "${fragment}"`,
    );
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
