import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const composePath = "compose.yaml";
const envExamplePath = ".env.example";
const expectedProjectName = "mykeys";
const expectedNetworkName = "mykeys_private";
const expectedPostgresImage = "postgres:18-alpine";
const expectedPostgresHostPort = "43130";
const expectedPostgresContainerPort = 5432;
const expectedPostgresVolumeName = "mykeys_postgres_data";
const expectedRedisImage = "redis:8.10-alpine";
const expectedRedisHostPort = "43140";
const expectedRedisContainerPort = 6379;
const expectedRedisVolumeName = "mykeys_redis_data";
const expectedLabelPrefix = "io.github.realfelipedeveloper";
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
const legacyOwnerPattern = new RegExp(["abba", "tech"].join(""), "i");

assert.equal(
  composeConfig.name,
  expectedProjectName,
  "Docker Compose project name must be the MyKeys namespace",
);
const services = composeConfig.services ?? {};
assert.deepEqual(
  Object.keys(services).sort(),
  ["postgres", "redis"],
  "TASK-007 must add PostgreSQL and Redis only",
);

assert.match(
  composeSource,
  /^name:\s+\$\{MYKEYS_COMPOSE_PROJECT_NAME:-mykeys\}/m,
  "compose.yaml must expose a configurable MyKeys project name",
);
assert.match(composeSource, /^\s+postgres:\s*$/m, "compose must define the postgres service");
assert.match(composeSource, /^\s+redis:\s*$/m, "compose must define the redis service");
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
assert.doesNotMatch(
  composeSource,
  legacyOwnerPattern,
  "compose labels must not use legacy external ownership",
);
assert.match(composeSource, /io\.github\.realfelipedeveloper\.project:\s+mykeys/);
assert.match(composeSource, /io\.github\.realfelipedeveloper\.namespace:\s+mykeys/);
assert.match(
  composeSource,
  /127\.0\.0\.1:\$\{MYKEYS_POSTGRES_PORT:-43130\}:5432/,
  "PostgreSQL must bind only to localhost and the SPEC-001 host port",
);
assert.match(
  composeSource,
  /PGDATA:\s+\/var\/lib\/postgresql\/18\/docker/,
  "PostgreSQL 18 must use the version-specific PGDATA path",
);
assert.match(composeSource, /pg_isready/, "PostgreSQL must define a healthcheck");
assert.match(composeSource, /mykeys_postgres_data:/, "PostgreSQL must use a named volume");
assert.match(
  composeSource,
  /127\.0\.0\.1:\$\{MYKEYS_REDIS_PORT:-43140\}:6379/,
  "Redis must bind only to localhost and the SPEC-001 host port",
);
assert.match(composeSource, /redis-cli/, "Redis must define a healthcheck");
assert.match(composeSource, /--appendonly/, "Redis must enable local append-only persistence");
assert.match(composeSource, /mykeys_redis_data:/, "Redis must use a named volume");

assert.equal(envExample.MYKEYS_COMPOSE_PROJECT_NAME, expectedProjectName);
assert.equal(envExample.MYKEYS_DOCKER_NETWORK, expectedNetworkName);
assert.equal(envExample.MYKEYS_POSTGRES_IMAGE, expectedPostgresImage);
assert.equal(envExample.MYKEYS_POSTGRES_DB, expectedProjectName);
assert.equal(envExample.MYKEYS_POSTGRES_USER, expectedProjectName);
assert.equal(envExample.MYKEYS_POSTGRES_AUTH_METHOD, "trust");
assert.equal(envExample.MYKEYS_POSTGRES_DATA_VOLUME, expectedPostgresVolumeName);
assert.equal(envExample.MYKEYS_REDIS_IMAGE, expectedRedisImage);
assert.equal(envExample.MYKEYS_REDIS_DATA_VOLUME, expectedRedisVolumeName);

assertPostgresService(services.postgres);
assertRedisService(services.redis);
assertNetwork(composeConfig.networks?.mykeys_private);

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

function assertPostgresService(service) {
  assert.ok(service, "postgres service must exist");
  assert.equal(service.image, expectedPostgresImage);
  assert.equal(service.restart, "unless-stopped");
  assert.ok(
    Object.hasOwn(service.networks ?? {}, "mykeys_private"),
    "postgres must join the MyKeys private network",
  );
  assertLabels(service.labels, "postgres");

  assert.equal(service.environment?.POSTGRES_DB, expectedProjectName);
  assert.equal(service.environment?.POSTGRES_USER, expectedProjectName);
  assert.equal(service.environment?.POSTGRES_HOST_AUTH_METHOD, "trust");
  assert.equal(service.environment?.PGDATA, "/var/lib/postgresql/18/docker");

  const postgresPort = service.ports?.[0];
  assert.ok(postgresPort, "postgres service must publish one localhost port");
  assert.equal(postgresPort.host_ip, "127.0.0.1");
  assert.equal(postgresPort.published, expectedPostgresHostPort);
  assert.equal(postgresPort.target, expectedPostgresContainerPort);
  assert.ok(!forbiddenHostPorts.has(postgresPort.published));

  assert.ok(service.healthcheck?.test?.join(" ").includes("pg_isready"));
  assert.deepEqual(service.volumes?.[0]?.target, "/var/lib/postgresql");

  const volumes = composeConfig.volumes ?? {};
  assert.ok(volumes.mykeys_postgres_data, "postgres named volume must exist");
  assert.equal(volumes.mykeys_postgres_data.name, expectedPostgresVolumeName);
  assertLabels(volumes.mykeys_postgres_data.labels, "postgres");
}

function assertRedisService(service) {
  assert.ok(service, "redis service must exist");
  assert.equal(service.image, expectedRedisImage);
  assert.equal(service.restart, "unless-stopped");
  assert.ok(
    Object.hasOwn(service.networks ?? {}, "mykeys_private"),
    "redis must join the MyKeys private network",
  );
  assertLabels(service.labels, "redis");

  const redisPort = service.ports?.[0];
  assert.ok(redisPort, "redis service must publish one localhost port");
  assert.equal(redisPort.host_ip, "127.0.0.1");
  assert.equal(redisPort.published, expectedRedisHostPort);
  assert.equal(redisPort.target, expectedRedisContainerPort);
  assert.ok(!forbiddenHostPorts.has(redisPort.published));

  assert.ok(service.healthcheck?.test?.join(" ").includes("redis-cli"));
  assert.ok(service.healthcheck?.test?.join(" ").includes("ping"));
  assert.deepEqual(service.volumes?.[0]?.target, "/data");

  const command = service.command?.join?.(" ") ?? String(service.command ?? "");
  assert.match(command, /redis-server/);
  assert.match(command, /--appendonly yes/);

  const volumes = composeConfig.volumes ?? {};
  assert.ok(volumes.mykeys_redis_data, "redis named volume must exist");
  assert.equal(volumes.mykeys_redis_data.name, expectedRedisVolumeName);
  assertLabels(volumes.mykeys_redis_data.labels, "redis");
}

function assertNetwork(network) {
  assert.equal(network?.labels?.[`${expectedLabelPrefix}.project`], expectedProjectName);
  assert.equal(network?.labels?.[`${expectedLabelPrefix}.namespace`], expectedProjectName);
}

function assertLabels(labels, serviceName) {
  assert.equal(labels?.[`${expectedLabelPrefix}.project`], expectedProjectName);
  assert.equal(labels?.[`${expectedLabelPrefix}.namespace`], expectedProjectName);
  assert.equal(labels?.[`${expectedLabelPrefix}.service`], serviceName);
}

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
