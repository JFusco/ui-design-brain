import { randomUUID } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  AUTHORITY,
  buildCatalogManifest,
  CATALOG_AUTHORITY_VERSION,
  CATALOG_MANIFEST,
  CATALOG_ROOT,
  loadCatalog,
  PACKAGE_NAME,
  PROJECTOR_SCHEMA_RELEASE_VERSION,
  readPackage,
} from "./catalog.mjs";
import { digestFiles, sha256, stableJson } from "./digest.mjs";

export const CONFIG_SCHEMA_VERSION = 1;
export const PROJECTION_SCHEMA_VERSION = 1;
export const FIRST_PROJECTOR_PACKAGE_VERSION = "1.16.0";
export const GENERATED_MARKER = ".ui-design-brain-generated";
export const PROJECTION_MANIFEST = "projection-manifest.json";

function comparePath(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertExactKeys(value, allowed, label) {
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unexpected.length > 0) {
    throw new Error(`${label} contains unsupported fields: ${unexpected.sort(comparePath).join(", ")}`);
  }
}

function validateTarget(target) {
  if (typeof target !== "string" || target.length === 0 || target.trim() !== target) {
    throw new Error("config.target must be a non-empty trimmed string");
  }
  if (target.includes("\\") || path.posix.isAbsolute(target)) {
    throw new Error("config.target must be a forward-slash relative path");
  }
  const normalized = path.posix.normalize(target);
  if (normalized === "." || normalized === ".." || normalized.startsWith("../") || normalized !== target) {
    throw new Error("config.target must be normalized and remain below the config directory");
  }
  return normalized;
}

function semverCore(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(version);
  return match ? match.slice(1, 4).map(Number) : null;
}

function supportsProjection(version) {
  const actual = semverCore(version);
  const minimum = semverCore(FIRST_PROJECTOR_PACKAGE_VERSION);
  if (!actual || !minimum) return false;
  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] > minimum[index]) return true;
    if (actual[index] < minimum[index]) return false;
  }
  return true;
}

function parseJson(raw, label) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`, { cause: error });
  }
}

function createMarker(provenance, provenanceRaw) {
  return [
    "UI_DESIGN_BRAIN_GENERATED=1",
    `generator=${PACKAGE_NAME}`,
    `packageVersion=${provenance.packageVersion}`,
    `catalogAuthorityVersion=${provenance.catalogAuthorityVersion}`,
    `profile=${provenance.profile}`,
    `sourceDigest=${provenance.sourceDigest}`,
    `configDigest=${provenance.configDigest}`,
    `outputDigest=${provenance.outputDigest}`,
    `provenanceDigest=${sha256(provenanceRaw)}`,
    "DO_NOT_EDIT=managed projection; change the pinned package or config and run sync",
    "",
  ].join("\n");
}

export async function loadConsumerConfig(configPath, packageRoot) {
  const absoluteConfig = path.resolve(configPath);
  let raw;
  try {
    raw = await readFile(absoluteConfig, "utf8");
  } catch (error) {
    throw new Error(`cannot read config ${absoluteConfig}: ${error.message}`, { cause: error });
  }

  const config = parseJson(raw, "consumer config");
  if (!isPlainObject(config)) throw new Error("consumer config must be an object");
  assertExactKeys(
    config,
    ["$schema", "catalogAuthorityVersion", "packageName", "packageVersion", "profile", "schemaVersion", "target"],
    "consumer config",
  );
  if (config.schemaVersion !== CONFIG_SCHEMA_VERSION) {
    throw new Error(`config.schemaVersion must be ${CONFIG_SCHEMA_VERSION}`);
  }
  if (config.$schema !== undefined && typeof config.$schema !== "string") {
    throw new Error("config.$schema must be a string when present");
  }
  if (config.packageName !== PACKAGE_NAME) throw new Error(`config.packageName must be ${PACKAGE_NAME}`);
  if (typeof config.packageVersion !== "string" || !semverCore(config.packageVersion)) {
    throw new Error("config.packageVersion must be an exact semantic version");
  }
  if (config.catalogAuthorityVersion !== CATALOG_AUTHORITY_VERSION) {
    throw new Error(`config.catalogAuthorityVersion must be ${CATALOG_AUTHORITY_VERSION}`);
  }
  if (config.profile !== "agent-skill") throw new Error('config.profile must be "agent-skill"');
  const target = validateTarget(config.target);

  const packageMetadata = await readPackage(packageRoot);
  if (!supportsProjection(packageMetadata.version)) {
    throw new Error(
      `${PACKAGE_NAME}@${packageMetadata.version} predates the projector; install and pin ${PACKAGE_NAME}@${FIRST_PROJECTOR_PACKAGE_VERSION} or newer`,
    );
  }
  if (config.packageVersion !== packageMetadata.version) {
    throw new Error(
      `config pins ${PACKAGE_NAME}@${config.packageVersion}, but the installed package is ${PACKAGE_NAME}@${packageMetadata.version}`,
    );
  }

  const normalized = {
    schemaVersion: CONFIG_SCHEMA_VERSION,
    packageName: PACKAGE_NAME,
    packageVersion: config.packageVersion,
    catalogAuthorityVersion: CATALOG_AUTHORITY_VERSION,
    profile: "agent-skill",
    target,
  };
  const configDirectory = path.dirname(absoluteConfig);
  const targetPath = path.resolve(configDirectory, ...target.split("/"));
  const relative = path.relative(configDirectory, targetPath);
  if (relative === "" || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error("config.target must remain below the config directory");
  }

  return {
    absoluteConfig,
    configDirectory,
    config: normalized,
    configDigest: sha256(stableJson(normalized)),
    targetPath,
  };
}

async function assertTargetPathSafe(configDirectory, target) {
  let current = configDirectory;
  const segments = target.split("/");
  for (let index = 0; index < segments.length; index += 1) {
    current = path.join(current, segments[index]);
    let stat;
    try {
      stat = await lstat(current);
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error(`config.target traverses a symbolic link: ${current}`);
    if (index < segments.length - 1 && !stat.isDirectory()) {
      throw new Error(`config.target traverses a non-directory entry: ${current}`);
    }
  }
}

async function expectedProjection(configPath, packageRoot) {
  const loaded = await loadConsumerConfig(configPath, packageRoot);
  await assertTargetPathSafe(loaded.configDirectory, loaded.config.target);
  await buildCatalogManifest(packageRoot, { check: true });
  const catalog = await loadCatalog(packageRoot);
  const generatedCatalogManifest = await readFile(path.join(packageRoot, CATALOG_MANIFEST));
  const outputFiles = [
    ...catalog.files,
    { path: "catalog-manifest.json", content: generatedCatalogManifest },
  ].sort((left, right) => comparePath(left.path, right.path));
  const { digest: outputDigest, records } = digestFiles(outputFiles);
  const provenance = {
    $schema: `https://raw.githubusercontent.com/JFusco/ui-design-brain/v${PROJECTOR_SCHEMA_RELEASE_VERSION}/schemas/projection-manifest.schema.json`,
    schemaVersion: PROJECTION_SCHEMA_VERSION,
    generatedBy: PACKAGE_NAME,
    packageVersion: loaded.config.packageVersion,
    catalogAuthorityVersion: CATALOG_AUTHORITY_VERSION,
    profile: loaded.config.profile,
    sourceDigest: catalog.sourceDigest,
    manifestDigest: catalog.manifestDigest,
    configDigest: loaded.configDigest,
    outputDigest,
    authority: AUTHORITY,
    files: records,
  };
  const provenanceRaw = stableJson(provenance);
  const marker = createMarker(provenance, provenanceRaw);

  const files = [
    ...outputFiles,
    { path: GENERATED_MARKER, content: Buffer.from(marker) },
    { path: PROJECTION_MANIFEST, content: Buffer.from(provenanceRaw) },
  ].sort((left, right) => comparePath(left.path, right.path));

  return {
    ...loaded,
    catalog,
    files,
    marker,
    outputDigest,
    provenance,
  };
}

async function pathExists(target) {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function listFiles(root, prefix = "") {
  const directory = path.join(root, ...prefix.split("/").filter(Boolean));
  const entries = (await readdir(directory, { withFileTypes: true })).sort((left, right) => comparePath(left.name, right.name));
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`generated projection contains a symbolic link: ${relative}`);
    if (entry.isDirectory()) files.push(...await listFiles(root, relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`generated projection contains an unsupported filesystem entry: ${relative}`);
  }
  return files;
}

async function assertExactProjection(targetPath, expectedFiles) {
  const expectedPaths = expectedFiles.map((file) => file.path).sort(comparePath);
  let actualPaths;
  try {
    actualPaths = (await listFiles(targetPath)).sort(comparePath);
  } catch (error) {
    if (error.code === "ENOENT") throw new Error(`generated projection is missing: ${targetPath}`, { cause: error });
    throw error;
  }
  if (stableJson(actualPaths) !== stableJson(expectedPaths)) {
    const missing = expectedPaths.filter((file) => !actualPaths.includes(file));
    const unexpected = actualPaths.filter((file) => !expectedPaths.includes(file));
    throw new Error(
      `generated projection file set is stale (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"})`,
    );
  }

  for (const file of expectedFiles) {
    const actual = await readFile(path.join(targetPath, ...file.path.split("/")));
    if (!actual.equals(Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content))) {
      throw new Error(`generated projection file is stale or edited: ${file.path}`);
    }
  }
}

async function readRecordedProjection(targetPath) {
  let marker;
  let provenanceRaw;
  try {
    marker = await readFile(path.join(targetPath, GENERATED_MARKER), "utf8");
    provenanceRaw = await readFile(path.join(targetPath, PROJECTION_MANIFEST), "utf8");
  } catch {
    throw new Error(`refusing to overwrite unmanaged target without ${GENERATED_MARKER}: ${targetPath}`);
  }
  if (!marker.startsWith("UI_DESIGN_BRAIN_GENERATED=1\n")) {
    throw new Error(`refusing to overwrite target with an invalid ${GENERATED_MARKER}: ${targetPath}`);
  }

  const provenance = parseJson(provenanceRaw, PROJECTION_MANIFEST);
  if (
    !isPlainObject(provenance) ||
    provenance.generatedBy !== PACKAGE_NAME ||
    provenance.schemaVersion !== PROJECTION_SCHEMA_VERSION ||
    provenance.catalogAuthorityVersion !== CATALOG_AUTHORITY_VERSION
  ) {
    throw new Error(`refusing to overwrite target with invalid ${PROJECTION_MANIFEST}: ${targetPath}`);
  }
  if (!Array.isArray(provenance.files) || typeof provenance.outputDigest !== "string") {
    throw new Error(`refusing to overwrite target with incomplete ${PROJECTION_MANIFEST}: ${targetPath}`);
  }

  const recordedFiles = provenance.files.map((record, index) => {
    if (!isPlainObject(record) || typeof record.path !== "string" || typeof record.sha256 !== "string") {
      throw new Error(`${PROJECTION_MANIFEST}.files[${index}] is invalid`);
    }
    const normalized = path.posix.normalize(record.path);
    if (
      normalized !== record.path ||
      path.posix.isAbsolute(record.path) ||
      normalized === "." ||
      normalized === ".." ||
      normalized.startsWith("../") ||
      record.path === GENERATED_MARKER ||
      record.path === PROJECTION_MANIFEST
    ) {
      throw new Error(`${PROJECTION_MANIFEST}.files[${index}].path is unsafe`);
    }
    return record;
  });

  const expectedPaths = [...recordedFiles.map((record) => record.path), GENERATED_MARKER, PROJECTION_MANIFEST].sort(comparePath);
  const actualPaths = (await listFiles(targetPath)).sort(comparePath);
  if (stableJson(actualPaths) !== stableJson(expectedPaths)) {
    throw new Error("refusing to overwrite a generated target with added, removed, or renamed files");
  }

  const files = [];
  for (const record of recordedFiles) {
    const content = await readFile(path.join(targetPath, ...record.path.split("/")));
    if (sha256(content) !== record.sha256) {
      throw new Error(`refusing to overwrite an edited generated file: ${record.path}`);
    }
    files.push({ path: record.path, content });
  }
  if (digestFiles(files).digest !== provenance.outputDigest || marker !== createMarker(provenance, provenanceRaw)) {
    throw new Error("refusing to overwrite a generated target with invalid digest provenance");
  }
  return provenance;
}

async function writeProjectionDirectory(targetPath, files) {
  await mkdir(targetPath, { recursive: true });
  for (const file of files) {
    const destination = path.join(targetPath, ...file.path.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.content, { mode: 0o644 });
  }
}

async function projectionMatches(targetPath, files) {
  try {
    await assertExactProjection(targetPath, files);
    return true;
  } catch {
    return false;
  }
}

async function assertAdoptableProjection(targetPath, expected) {
  const sourceFiles = expected.files.filter((file) => ![GENERATED_MARKER, PROJECTION_MANIFEST].includes(file.path));
  const required = sourceFiles.filter((file) => file.path !== "catalog-manifest.json");
  const allowedPaths = sourceFiles.map((file) => file.path).sort(comparePath);
  const requiredPaths = required.map((file) => file.path).sort(comparePath);
  const actualPaths = (await listFiles(targetPath)).sort(comparePath);
  const hasGeneratedCatalog = actualPaths.includes("catalog-manifest.json");
  const expectedPaths = hasGeneratedCatalog ? allowedPaths : requiredPaths;
  if (stableJson(actualPaths) !== stableJson(expectedPaths)) {
    const missing = requiredPaths.filter((file) => !actualPaths.includes(file));
    const unexpected = actualPaths.filter((file) => !allowedPaths.includes(file));
    throw new Error(
      `refusing to adopt target with a non-catalog file set (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"})`,
    );
  }

  for (const expectedFile of sourceFiles) {
    if (!actualPaths.includes(expectedFile.path)) continue;
    const actual = await readFile(path.join(targetPath, ...expectedFile.path.split("/")));
    const expectedContent = Buffer.isBuffer(expectedFile.content) ? expectedFile.content : Buffer.from(expectedFile.content);
    if (expectedFile.path === "patterns-manifest.json" || expectedFile.path === "catalog-manifest.json") {
      const actualJson = parseJson(actual.toString("utf8"), expectedFile.path);
      const expectedJson = parseJson(expectedContent.toString("utf8"), `package ${expectedFile.path}`);
      if (stableJson(actualJson) !== stableJson(expectedJson)) {
        throw new Error(`refusing to adopt target with different catalog data: ${expectedFile.path}`);
      }
    } else if (!actual.equals(expectedContent)) {
      throw new Error(`refusing to adopt target with different catalog content: ${expectedFile.path}`);
    }
  }
}

export async function checkProjection({ configPath, packageRoot }) {
  const expected = await expectedProjection(configPath, packageRoot);
  await assertExactProjection(expected.targetPath, expected.files);
  return {
    changed: false,
    targetPath: expected.targetPath,
    outputDigest: expected.outputDigest,
  };
}

export async function syncProjection({ configPath, packageRoot, ifNeeded = false, adopt = false }) {
  const expected = await expectedProjection(configPath, packageRoot);
  const mode = ifNeeded ? "if-needed" : "sync";
  let adopted = false;
  if (await pathExists(expected.targetPath)) {
    if (await projectionMatches(expected.targetPath, expected.files)) {
      return { adopted, changed: false, mode, targetPath: expected.targetPath, outputDigest: expected.outputDigest };
    }
    if (await pathExists(path.join(expected.targetPath, GENERATED_MARKER))) {
      await readRecordedProjection(expected.targetPath);
    } else if (adopt) {
      await assertAdoptableProjection(expected.targetPath, expected);
      adopted = true;
    } else {
      await readRecordedProjection(expected.targetPath);
    }
  }

  const parent = path.dirname(expected.targetPath);
  const base = path.basename(expected.targetPath);
  await mkdir(parent, { recursive: true });
  const token = `${process.pid}-${randomUUID()}`;
  const temporary = path.join(parent, `.${base}.ui-design-brain-tmp-${token}`);
  const backup = path.join(parent, `.${base}.ui-design-brain-backup-${token}`);
  let movedOriginal = false;
  let promoted = false;

  try {
    await writeProjectionDirectory(temporary, expected.files);
    await assertExactProjection(temporary, expected.files);
    if (await pathExists(expected.targetPath)) {
      await rename(expected.targetPath, backup);
      movedOriginal = true;
    }
    await rename(temporary, expected.targetPath);
    promoted = true;
    await assertExactProjection(expected.targetPath, expected.files);
    if (movedOriginal) await rm(backup, { recursive: true, force: true });
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    if (promoted && await pathExists(expected.targetPath)) {
      await rm(expected.targetPath, { recursive: true, force: true });
    }
    if (movedOriginal && await pathExists(backup)) {
      await rename(backup, expected.targetPath);
    }
    throw error;
  }

  return { adopted, changed: true, mode, targetPath: expected.targetPath, outputDigest: expected.outputDigest };
}

export function projectionCatalogPath(packageRoot) {
  return path.join(packageRoot, CATALOG_ROOT);
}
