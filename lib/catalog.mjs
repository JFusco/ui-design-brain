import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { digestFiles, sha256, stableJson } from "./digest.mjs";

export const CATALOG_SCHEMA_VERSION = 1;
export const CATALOG_AUTHORITY_VERSION = "1.18.0";
export const CATALOG_AUTHORITY_MANIFEST_DIGEST = "sha256:f94db7c94f99d74983078bdf35e5854584fdd7875af1bf7c7d6fbcb17b459ab5";
export const PROJECTOR_SCHEMA_RELEASE_VERSION = "1.16.0";
export const CATALOG_ROOT = "skills/ui-design-brain";
export const CATALOG_MANIFEST = `${CATALOG_ROOT}/catalog-manifest.json`;
export const PACKAGE_NAME = "@verndale/ui-design-brain";

export const AUTHORITY = Object.freeze({
  owns: [
    "canonical-names",
    "slugs",
    "aliases",
    "contextual-disambiguation",
    "bounded-product-guidance",
  ],
  excludes: [
    "accessibility-semantics",
    "accessibility-applicability",
    "accessibility-evidence-routes",
    "ui-pattern-to-accessibility-pattern-mappings",
  ],
  accessibilityProse: "non-normative-pending-parity",
});

function comparePath(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function kebab(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertExactKeys(value, allowed, label) {
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unexpected.length > 0) {
    throw new Error(`${label} contains unsupported fields: ${unexpected.sort(comparePath).join(", ")}`);
  }
}

function validateAlias(alias, label) {
  if (typeof alias === "string") {
    if (alias.trim() !== alias || alias.length === 0) throw new Error(`${label} must be a non-empty trimmed string`);
    return alias;
  }

  assertPlainObject(alias, label);
  assertExactKeys(alias, ["context", "name"], label);
  for (const key of ["name", "context"]) {
    if (typeof alias[key] !== "string" || alias[key].trim() !== alias[key] || alias[key].length === 0) {
      throw new Error(`${label}.${key} must be a non-empty trimmed string`);
    }
  }
  return `${alias.name}\u0000${alias.context}`;
}

function validateEntries(entries) {
  if (!Array.isArray(entries)) throw new Error("patterns-manifest.json must contain a top-level array");

  const names = new Set();
  const slugs = new Set();
  const files = new Set();

  entries.forEach((entry, index) => {
    const label = `patterns-manifest.json[${index}]`;
    assertPlainObject(entry, label);
    assertExactKeys(entry, ["aliases", "file", "name", "slug"], label);

    if (typeof entry.name !== "string" || entry.name.trim() !== entry.name || entry.name.length === 0) {
      throw new Error(`${label}.name must be a non-empty trimmed string`);
    }
    if (typeof entry.slug !== "string" || entry.slug !== kebab(entry.name)) {
      throw new Error(`${label}.slug must equal the kebab-case canonical name`);
    }
    if (entry.file !== `patterns/${entry.slug}.md`) {
      throw new Error(`${label}.file must equal patterns/${entry.slug}.md`);
    }
    if (!Array.isArray(entry.aliases)) throw new Error(`${label}.aliases must be an array`);

    const normalizedName = entry.name.toLocaleLowerCase("en-US");
    if (names.has(normalizedName)) throw new Error(`duplicate canonical name: ${entry.name}`);
    if (slugs.has(entry.slug)) throw new Error(`duplicate slug: ${entry.slug}`);
    if (files.has(entry.file)) throw new Error(`duplicate pattern file: ${entry.file}`);
    names.add(normalizedName);
    slugs.add(entry.slug);
    files.add(entry.file);

    const aliases = new Set();
    entry.aliases.forEach((alias, aliasIndex) => {
      const normalized = validateAlias(alias, `${label}.aliases[${aliasIndex}]`).toLocaleLowerCase("en-US");
      if (aliases.has(normalized)) throw new Error(`${label} contains a duplicate alias`);
      aliases.add(normalized);
    });
  });
}

async function readJson(file, label) {
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    throw new Error(`cannot read ${label}: ${error.message}`, { cause: error });
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`, { cause: error });
  }
}

export async function readPackage(root) {
  const metadata = await readJson(path.join(root, "package.json"), "package.json");
  if (metadata.name !== PACKAGE_NAME) throw new Error(`package.json name must be ${PACKAGE_NAME}`);
  if (metadata.private !== false) throw new Error("package.json must set private: false for public npm distribution");
  if (metadata.publishConfig?.access !== "public") {
    throw new Error("package.json must set publishConfig.access to public");
  }
  if (typeof metadata.version !== "string" || metadata.version.length === 0) {
    throw new Error("package.json version must be a non-empty string");
  }
  return metadata;
}

export async function loadCatalog(root) {
  const catalogRoot = path.join(root, CATALOG_ROOT);
  const manifestPath = path.join(catalogRoot, "patterns-manifest.json");
  const entries = await readJson(manifestPath, "patterns-manifest.json");
  validateEntries(entries);

  const patternEntries = await readdir(path.join(catalogRoot, "patterns"), { withFileTypes: true });
  const unsupported = patternEntries.filter((entry) => !entry.isFile() || !entry.name.endsWith(".md"));
  if (unsupported.length > 0) {
    throw new Error(`patterns/ contains unsupported entries: ${unsupported.map((entry) => entry.name).sort(comparePath).join(", ")}`);
  }
  const patternNames = patternEntries
    .map((entry) => `patterns/${entry.name}`)
    .sort(comparePath);
  const referencedNames = entries.map((entry) => entry.file).sort(comparePath);
  if (stableJson(patternNames) !== stableJson(referencedNames)) {
    const orphaned = patternNames.filter((file) => !referencedNames.includes(file));
    const missing = referencedNames.filter((file) => !patternNames.includes(file));
    throw new Error(
      `pattern file set does not match the manifest (missing: ${missing.join(", ") || "none"}; orphaned: ${orphaned.join(", ") || "none"})`,
    );
  }

  const relativeFiles = ["SKILL.md", "index.md", "patterns-manifest.json", ...referencedNames].sort(comparePath);
  const files = [];
  for (const relative of relativeFiles) {
    const source = path.join(catalogRoot, relative);
    const stat = await lstat(source);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`catalog source must be a regular file: ${relative}`);
    const content = await readFile(source);
    files.push({ path: relative, content });
  }

  const { digest: sourceDigest, records } = digestFiles(files);
  const manifestDigest = sha256(stableJson(entries));
  if (manifestDigest !== CATALOG_AUTHORITY_MANIFEST_DIGEST) {
    throw new Error(
      `patterns-manifest.json no longer matches catalog authority ${CATALOG_AUTHORITY_VERSION}; update the authority version and pinned manifest digest together (received ${manifestDigest})`,
    );
  }
  return {
    entries,
    files,
    sourceDigest,
    manifestDigest,
    records,
  };
}

export async function createCatalogManifest(root) {
  const catalog = await loadCatalog(root);
  return {
    $schema: `https://raw.githubusercontent.com/verndale/ui-design-brain/v${PROJECTOR_SCHEMA_RELEASE_VERSION}/schemas/catalog-manifest.schema.json`,
    schemaVersion: CATALOG_SCHEMA_VERSION,
    catalog: "ui-design-brain",
    catalogAuthorityVersion: CATALOG_AUTHORITY_VERSION,
    patternCount: catalog.entries.length,
    sourceDigest: catalog.sourceDigest,
    manifestDigest: catalog.manifestDigest,
    authority: AUTHORITY,
    files: catalog.records,
  };
}

export async function buildCatalogManifest(root, { check = false } = {}) {
  const destination = path.join(root, CATALOG_MANIFEST);
  const expected = stableJson(await createCatalogManifest(root));

  if (check) {
    let actual;
    try {
      actual = await readFile(destination, "utf8");
    } catch {
      throw new Error(`${CATALOG_MANIFEST} is missing; run ui-design-brain build`);
    }
    if (actual !== expected) throw new Error(`${CATALOG_MANIFEST} is stale; run ui-design-brain build`);
    return { changed: false, destination };
  }

  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.tmp-${process.pid}`;
  await writeFile(temporary, expected, { mode: 0o644 });
  await rename(temporary, destination).catch(async (error) => {
    await rm(temporary, { force: true });
    throw error;
  });
  return { changed: true, destination };
}
