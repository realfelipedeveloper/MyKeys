import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const composePath = "compose.yaml";
const envExamplePath = ".env.example";
const expectedProjectName = "mykeys";
const expectedNetworkName = "mykeys_private";
const forbiddenHostPorts = new Set(["3000", "3001", "5432", "6379", "8080"]);
const expectedPorts = {
  MYKEYS_WEB_PORT: "43110",
  MYKEYS_CORE_API_PORT: "43120",
  MYKEYS_PAYMENT_API_PORT: "43121",
  MYKEYS_NOTIFICATION_API_PORT: "43122",
  MYKEYS_POSTGRES_PORT: "43130",
  MYKEYS_REDIS_PORT: "43140",
  MYKEYS_MAIL_SMTP_PORT: "43150",
  MYKEYS_MAIL_UI_PORT: "43151",
  MYKEYS_MINIO_PORT: "43160",
  MYKEYS_MINIO_CONSOLE_PORT: "43161",
};
const sensitiveEnvNamePattern =
  /(^|_)(SECRET|PASSWORD|TOKEN|PRIVATE_KEY|API_KEY|CVV|RECOVERY_KEY)($|_)/i;

const composeSource = await readFile(composePath, "utf8");
const envExampleSource = await readFile(envExamplePath, "utf8");
const composeConfig = readComposeConfig();
const envExample = parseEnvExample(envExampleSource);

assert.equal(
  composeConfig.name,
  expectedProjectName,
  "Docker Compose project name must be the MyKeys namespace",
);
assert.deepEqual(
  composeConfig.services ?? {},
  {},
  "TASK-005 must not add real services before TASK-006..TASK-009",
);

assert.match(
  composeSource,
  /^name:\s+\$\{MYKEYS_COMPOSE_PROJECT_NAME:-mykeys\}/m,
  "compose.yaml must expose a configurable MyKeys project name",
);
assert.match(composeSource, /^services:\s+\{\}/m, "TASK-005 compose must remain service-free");
assert.doesNotMatch(
  composeSource,
  /\bcontainer_name\s*:/,
  "compose must not use rigid container_name",
);
assert.match(composeSource, /mykeys_private:/, "compose must define the MyKeys private network");
assert.match(
  composeSource,
  /\$\{MYKEYS_DOCKER_NETWORK:-mykeys_private\}/,
  "compose network name must be configurable",
);
assert.match(composeSource, /br\.com\.abbatech\.project:\s+mykeys/);
assert.match(composeSource, /br\.com\.abbatech\.namespace:\s+mykeys/);

assert.equal(envExample.MYKEYS_COMPOSE_PROJECT_NAME, expectedProjectName);
assert.equal(envExample.MYKEYS_DOCKER_NETWORK, expectedNetworkName);

for (const [name, port] of Object.entries(expectedPorts)) {
  assert.equal(envExample[name], port, `${name} must use the SPEC-001 non-default port`);
  assert.ok(!forbiddenHostPorts.has(port), `${name} must not use a forbidden host port`);
}

for (const forbiddenPort of forbiddenHostPorts) {
  assert.doesNotMatch(
    composeSource,
    new RegExp(`(^|[^0-9])${forbiddenPort}:`, "m"),
    `compose.yaml must not bind forbidden host port ${forbiddenPort}`,
  );
}

console.log("MyKeys Docker Compose namespace is valid.");

function readComposeConfig() {
  const result = spawnSync(
    "docker",
    ["compose", "--env-file", envExamplePath, "-f", composePath, "config", "--format", "json"],
    {
      encoding: "utf8",
      stdio: "pipe",
    },
  );

  assert.equal(
    result.status,
    0,
    `docker compose config failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return JSON.parse(result.stdout);
}

function parseEnvExample(source) {
  const entries = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    assert.ok(separatorIndex > 0, `.env.example line must be KEY=value: ${line}`);

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);

    assert.doesNotMatch(key, sensitiveEnvNamePattern, `${key} must not define a secret`);
    entries[key] = value;
  }

  return entries;
}
