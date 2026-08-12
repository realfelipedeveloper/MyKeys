import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflowPath = ".github/workflows/promotions.yml";
const workflow = await readFile(workflowPath, "utf8");

assert.match(workflow, /^name:\s+MyKeys Promotions$/m, "promotion workflow must be named");
assert.match(
  workflow,
  /push:\s+branches:\s+- feature\/\*\*\s+- development\s+- homologation/s,
  "promotion workflow must run after feature pushes and merges into development or homologation",
);
assert.doesNotMatch(
  workflow,
  /push:\s+branches:\s+- feature\/\*\*\s+- development\s+- homologation\s+- main/s,
  "promotion workflow must not open PRs after pushes to main",
);
assert.match(workflow, /workflow_dispatch:/, "promotion workflow must allow manual dispatch");
assert.match(workflow, /source_branch:/, "manual dispatch must require a source branch");
assert.match(workflow, /target_branch:/, "manual dispatch must allow an explicit target branch");
assert.match(workflow, /contents: read/, "promotion workflow must use read-only contents access");
assert.match(
  workflow,
  /pull-requests: write/,
  "promotion workflow must be allowed to open pull requests",
);
assert.match(
  workflow,
  /secrets\.MYKEYS_AUTOMATION_TOKEN \|\| github\.token/,
  "promotion workflow must support an optional automation token fallback",
);
assert.match(
  workflow,
  /\[\[ "\$SOURCE_BRANCH" == feature\/\* \]\]; then\s+TARGET_BRANCH="development"/s,
  "feature branches must open pull requests to development",
);
assert.match(
  workflow,
  /development\)\s+TARGET_BRANCH="homologation"/s,
  "development must promote to homologation",
);
assert.match(
  workflow,
  /homologation\)\s+TARGET_BRANCH="main"/s,
  "homologation must promote to main",
);
assert.match(
  workflow,
  /gh api "repos\/\$\{GH_REPO\}\/compare\/\$\{TARGET\}\.\.\.\$\{SOURCE\}"/,
  "promotion workflow must compare source and target before creating a PR",
);
assert.match(workflow, /gh pr list/, "promotion workflow must check existing PRs");
assert.match(workflow, /gh pr create/, "promotion workflow must create promotion PRs");
assert.match(
  workflow,
  /steps\.existing\.outputs\.exists == 'false'/,
  "promotion workflow must avoid duplicate PRs",
);
assert.match(
  workflow,
  /feature\/\* -> development -> homologation -> main/,
  "promotion workflow body must document the required promotion sequence",
);
assert.doesNotMatch(
  workflow,
  /pull_request_target/,
  "promotion workflow must not use pull_request_target",
);
assert.doesNotMatch(
  workflow,
  /\bcontents: write\b/,
  "promotion workflow must not write repository contents",
);
assert.doesNotMatch(workflow, /\bgh pr merge\b/, "promotion workflow must not merge pull requests");
assert.doesNotMatch(workflow, /\bgit push\b/, "promotion workflow must not push commits");

console.log("MyKeys promotion workflow is valid.");
