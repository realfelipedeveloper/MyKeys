import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflowPath = ".github/workflows/ci.yml";
const workflow = await readFile(workflowPath, "utf8");

for (const branch of ["development", "homologation", "main"]) {
  assert.match(workflow, new RegExp(`\\n\\s+- ${branch}\\n`), `CI must target ${branch}`);
}

for (const command of [
  "pnpm install --frozen-lockfile",
  "pnpm check:promotions",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
  "pnpm audit --audit-level high",
  "pnpm nx show projects",
  "docker compose --env-file .env.example -f compose.yaml config --format json",
]) {
  assert.match(workflow, new RegExp(escapeRegExp(command)), `CI must run: ${command}`);
}

assert.match(
  workflow,
  /permissions:\s+contents: read/s,
  "CI must use read-only contents permission",
);
assert.match(workflow, /actions\/checkout@v5/, "CI must use official checkout action");
assert.match(workflow, /actions\/setup-node@v5/, "CI must use official setup-node action");
assert.match(workflow, /node-version: 24\.14\.1/, "CI must pin the Node version");
assert.match(
  workflow,
  /package-manager-cache: false/,
  "CI must disable setup-node automatic package-manager cache",
);
assert.match(workflow, /corepack prepare pnpm@11\.20\.0 --activate/, "CI must pin pnpm");
assert.doesNotMatch(workflow, /actions\/checkout@v4/, "CI must not use Node 20 checkout");
assert.doesNotMatch(workflow, /actions\/setup-node@v4/, "CI must not use Node 20 setup-node");
assert.doesNotMatch(workflow, /pull_request_target/, "CI must not use pull_request_target");
assert.doesNotMatch(workflow, /secrets\./, "CI must not consume secrets in the baseline pipeline");

console.log("MyKeys GitHub Actions CI workflow is valid.");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
