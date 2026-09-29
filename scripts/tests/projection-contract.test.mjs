import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFile, mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  AUTHORITY,
  buildCatalogManifest,
  createCatalogManifest,
  loadCatalog,
  readPackage,
} from "../../lib/catalog.mjs";
import {
  checkProjection,
  GENERATED_MARKER,
  PROJECTION_MANIFEST,
  syncProjection,
} from "../../lib/projection.mjs";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

async function fixture(t, target = "generated/ui-design-brain") {
  const root = await mkdtemp(path.join(os.tmpdir(), "ui-design-brain-projection-"));
  t.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(root, { recursive: true, force: true });
  });
  const metadata = await readPackage(packageRoot);
  const configPath = path.join(root, "ui-design-brain.config.json");
  await writeFile(configPath, `${JSON.stringify({
    $schema: "./node_modules/@verndale/ui-design-brain/schemas/consumer-config.schema.json",
    schemaVersion: 1,
    packageName: "@verndale/ui-design-brain",
    packageVersion: metadata.version,
    catalogAuthorityVersion: "1.18.0",
    profile: "agent-skill",
    target,
  }, null, 2)}\n`);
  return { configPath, root, targetPath: path.join(root, ...target.split("/")) };
}

test("catalog manifest captures the complete bounded authority with stable digests", async () => {
  await buildCatalogManifest(packageRoot, { check: true });
  const manifest = await createCatalogManifest(packageRoot);
  const catalog = await loadCatalog(packageRoot);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.catalogAuthorityVersion, "1.18.0");
  assert.equal(manifest.patternCount, 82);
  assert.equal(manifest.sourceDigest, catalog.sourceDigest);
  assert.deepEqual(manifest.authority, AUTHORITY);
  assert.equal(manifest.authority.accessibilityProse, "non-normative-pending-parity");
  assert.ok(manifest.authority.excludes.includes("ui-pattern-to-accessibility-pattern-mappings"));
  assert.ok(catalog.entries.every((entry) => Object.keys(entry).every((key) => ["aliases", "file", "name", "slug"].includes(key))));
});

test("all shipped JSON schemas are valid and the pre-projector package fails explicitly", async (t) => {
  const schemaNames = (await readdir(path.join(packageRoot, "schemas")))
    .filter((name) => name.endsWith(".schema.json"));
  assert.deepEqual(schemaNames.sort(), [
    "catalog-manifest.schema.json",
    "consumer-config.schema.json",
    "patterns-manifest.schema.json",
    "projection-manifest.schema.json",
  ]);
  for (const schemaName of schemaNames) {
    const schema = await readFile(path.join(packageRoot, "schemas", schemaName), "utf8");
    assert.doesNotThrow(() => JSON.parse(schema));
  }

  const legacyRoot = await mkdtemp(path.join(os.tmpdir(), "ui-design-brain-v1.15.1-"));
  t.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(legacyRoot, { recursive: true, force: true });
  });
  await writeFile(path.join(legacyRoot, "package.json"), `${JSON.stringify({
    name: "@verndale/ui-design-brain",
    version: "1.15.1",
    private: false,
    publishConfig: { access: "public" },
  })}\n`);
  const consumer = await fixture(t, "legacy-projector/ui-design-brain");
  const config = JSON.parse(await readFile(consumer.configPath, "utf8"));
  config.packageVersion = "1.15.1";
  await writeFile(consumer.configPath, `${JSON.stringify(config, null, 2)}\n`);
  await assert.rejects(
    syncProjection({ configPath: consumer.configPath, packageRoot: legacyRoot, ifNeeded: true }),
    /1\.15\.1 predates the projector/,
  );
});

test("sync creates a marker-owned projection and --if-needed is a byte-stable no-op", async (t) => {
  const { configPath, targetPath } = await fixture(t);
  const first = await syncProjection({ configPath, packageRoot, ifNeeded: true });
  assert.equal(first.changed, true);
  await checkProjection({ configPath, packageRoot });

  const provenance = JSON.parse(await readFile(path.join(targetPath, PROJECTION_MANIFEST), "utf8"));
  const marker = await readFile(path.join(targetPath, GENERATED_MARKER), "utf8");
  assert.equal(provenance.packageVersion, (await readPackage(packageRoot)).version);
  assert.equal(provenance.catalogAuthorityVersion, "1.18.0");
  assert.equal(provenance.outputDigest, first.outputDigest);
  assert.match(marker, new RegExp(`outputDigest=${first.outputDigest.replace(":", "\\:")}`));

  const before = await readFile(path.join(targetPath, "catalog-manifest.json"));
  const second = await syncProjection({ configPath, packageRoot, ifNeeded: true });
  const after = await readFile(path.join(targetPath, "catalog-manifest.json"));
  assert.equal(second.changed, false);
  assert.deepEqual(after, before);
});

test("sync refuses unmanaged or locally edited targets", async (t) => {
  const unmanaged = await fixture(t, "unmanaged/ui-design-brain");
  await mkdir(unmanaged.targetPath, { recursive: true });
  await writeFile(path.join(unmanaged.targetPath, "SKILL.md"), "local authority\n");
  await assert.rejects(
    syncProjection({ configPath: unmanaged.configPath, packageRoot, ifNeeded: true }),
    /refusing to overwrite unmanaged target/,
  );

  const managed = await fixture(t, "managed/ui-design-brain");
  await syncProjection({ configPath: managed.configPath, packageRoot, ifNeeded: true });
  await appendFile(path.join(managed.targetPath, "SKILL.md"), "local edit\n");
  await assert.rejects(
    syncProjection({ configPath: managed.configPath, packageRoot, ifNeeded: true }),
    /refusing to overwrite an edited generated file: SKILL.md/,
  );
  await assert.rejects(
    checkProjection({ configPath: managed.configPath, packageRoot }),
    /generated projection file is stale or edited: SKILL.md/,
  );
});

test("--adopt accepts only a byte-identical legacy catalog with semantic manifest formatting", async (t) => {
  const legacy = await fixture(t, "legacy/ui-design-brain");
  const catalog = await loadCatalog(packageRoot);
  await mkdir(legacy.targetPath, { recursive: true });
  for (const file of catalog.files) {
    const destination = path.join(legacy.targetPath, ...file.path.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    const content = file.path === "patterns-manifest.json"
      ? `${JSON.stringify(JSON.parse(file.content.toString("utf8")))}\n`
      : file.content;
    await writeFile(destination, content);
  }
  const adopted = await syncProjection({ configPath: legacy.configPath, packageRoot, adopt: true, ifNeeded: true });
  assert.equal(adopted.adopted, true);
  await checkProjection({ configPath: legacy.configPath, packageRoot });

  const divergent = await fixture(t, "divergent/ui-design-brain");
  await mkdir(divergent.targetPath, { recursive: true });
  for (const file of catalog.files) {
    const destination = path.join(divergent.targetPath, ...file.path.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.content);
  }
  await appendFile(path.join(divergent.targetPath, "patterns/modal.md"), "different\n");
  await assert.rejects(
    syncProjection({ configPath: divergent.configPath, packageRoot, adopt: true, ifNeeded: true }),
    /refusing to adopt target with different catalog content: patterns\/modal.md/,
  );
});

test("consumer config fails closed on package version or target traversal", async (t) => {
  const mismatch = await fixture(t, "generated/ui-design-brain");
  const config = JSON.parse(await readFile(mismatch.configPath, "utf8"));
  config.packageVersion = "999.0.0";
  await writeFile(mismatch.configPath, `${JSON.stringify(config, null, 2)}\n`);
  await assert.rejects(
    syncProjection({ configPath: mismatch.configPath, packageRoot, ifNeeded: true }),
    /but the installed package is/,
  );

  config.packageVersion = (await readPackage(packageRoot)).version;
  config.target = "../escape";
  await writeFile(mismatch.configPath, `${JSON.stringify(config, null, 2)}\n`);
  await assert.rejects(
    syncProjection({ configPath: mismatch.configPath, packageRoot, ifNeeded: true }),
    /must be normalized and remain below/,
  );

  const linked = await fixture(t, "linked/ui-design-brain");
  await symlink(path.join(linked.root, "outside"), path.join(linked.root, "linked"));
  await assert.rejects(
    syncProjection({ configPath: linked.configPath, packageRoot, ifNeeded: true }),
    /config\.target traverses a symbolic link/,
  );
});

test("the constrained public packed artifact can project in an offline consumer fixture", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ui-design-brain-packed-"));
  t.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(root, { recursive: true, force: true });
  });
  const packDirectory = path.join(root, "pack");
  const consumer = path.join(root, "consumer");
  await mkdir(packDirectory, { recursive: true });
  await mkdir(consumer, { recursive: true });

  const packed = spawnSync(
    "npm",
    ["pack", "--ignore-scripts", "--pack-destination", packDirectory],
    {
      cwd: packageRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_audit: "false",
        npm_config_cache: path.join(root, "npm-cache"),
        npm_config_fund: "false",
      },
    },
  );
  assert.equal(packed.status, 0, packed.stderr);
  const tarballName = packed.stdout.trim().split(/\r?\n/).at(-1);
  const tarball = path.join(packDirectory, tarballName);

  const listing = spawnSync("tar", ["-tzf", tarball], { encoding: "utf8" });
  assert.equal(listing.status, 0, listing.stderr);
  for (const expected of [
    "package/bin/ui-design-brain.mjs",
    "package/lib/projection.mjs",
    "package/schemas/consumer-config.schema.json",
    "package/skills/ui-design-brain/catalog-manifest.json",
    "package/skills/ui-design-brain/patterns/modal.md",
  ]) {
    assert.match(listing.stdout, new RegExp(`^${expected.replaceAll(".", "\\.")}$`, "m"));
  }
  for (const excluded of ["package/wiki/", "package/.github/", "package/.releaserc.cjs"]) {
    assert.doesNotMatch(listing.stdout, new RegExp(`^${excluded.replaceAll(".", "\\.")}` , "m"));
  }
  const packagedContent = spawnSync("tar", ["-xOzf", tarball], { encoding: "utf8" });
  assert.equal(packagedContent.status, 0, packagedContent.stderr);
  assert.doesNotMatch(
    packagedContent.stdout,
    /verndale\/(?:ai-orchestration|COS-monorepo)|\bV00066\b|BOT_TOKEN|RELEASE_NOTES_AI|@gmail\.com/i,
  );

  await writeFile(path.join(consumer, "package.json"), `${JSON.stringify({
    name: "ui-design-brain-packed-consumer",
    private: true,
    dependencies: { "@verndale/ui-design-brain": `file:${tarball}` },
  }, null, 2)}\n`);
  const installed = spawnSync(
    "npm",
    ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
    { cwd: consumer, encoding: "utf8", env: { ...process.env, npm_config_cache: path.join(root, "npm-cache") } },
  );
  assert.equal(installed.status, 0, installed.stderr);

  const metadata = await readPackage(packageRoot);
  const configPath = path.join(consumer, "ui-design-brain.config.json");
  await writeFile(configPath, `${JSON.stringify({
    schemaVersion: 1,
    packageName: "@verndale/ui-design-brain",
    packageVersion: metadata.version,
    catalogAuthorityVersion: "1.18.0",
    profile: "agent-skill",
    target: "generated/ui-design-brain",
  }, null, 2)}\n`);
  const cli = path.join(consumer, "node_modules/@verndale/ui-design-brain/bin/ui-design-brain.mjs");
  const synced = spawnSync(process.execPath, [cli, "sync", "--if-needed", "--config", configPath], {
    cwd: consumer,
    encoding: "utf8",
    env: { ...process.env, npm_config_offline: "true" },
  });
  assert.equal(synced.status, 0, synced.stderr);
  const checked = spawnSync(process.execPath, [cli, "check", "--config", configPath], {
    cwd: consumer,
    encoding: "utf8",
    env: { ...process.env, npm_config_offline: "true" },
  });
  assert.equal(checked.status, 0, checked.stderr);
});
