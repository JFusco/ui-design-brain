#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import { buildCatalogManifest, createCatalogManifest } from "../lib/catalog.mjs";
import { checkProjection, syncProjection } from "../lib/projection.mjs";
import { stableJson } from "../lib/digest.mjs";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

function usage() {
  return [
    "Usage:",
    "  ui-design-brain build [--check]",
    "  ui-design-brain manifest",
    "  ui-design-brain sync [--if-needed] [--adopt] --config <path>",
    "  ui-design-brain check --config <path>",
  ].join("\n");
}

function parseOptions(args, allowed) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!allowed.includes(argument)) throw new Error(`unsupported option: ${argument}\n${usage()}`);
    if (argument === "--config") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--config requires a path");
      options.config = value;
      index += 1;
    } else if (argument === "--check") {
      options.check = true;
    } else if (argument === "--if-needed") {
      options.ifNeeded = true;
    } else if (argument === "--adopt") {
      options.adopt = true;
    }
  }
  return options;
}

async function run() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (command === "build") {
    const options = parseOptions(args, ["--check"]);
    const result = await buildCatalogManifest(packageRoot, { check: options.check });
    process.stdout.write(`ui-design-brain: catalog manifest ${options.check ? "verified" : "built"} at ${result.destination}\n`);
    return;
  }

  if (command === "manifest") {
    parseOptions(args, []);
    process.stdout.write(stableJson(await createCatalogManifest(packageRoot)));
    return;
  }

  if (command === "sync") {
    const options = parseOptions(args, ["--adopt", "--config", "--if-needed"]);
    if (!options.config) throw new Error("sync requires --config <path>");
    const result = await syncProjection({
      configPath: options.config,
      packageRoot,
      ifNeeded: options.ifNeeded,
      adopt: options.adopt,
    });
    process.stdout.write(
      `ui-design-brain: projection ${result.adopted ? "adopted and synchronized" : result.changed ? "synchronized" : "already current"} at ${result.targetPath} (${result.outputDigest})\n`,
    );
    return;
  }

  if (command === "check") {
    const options = parseOptions(args, ["--config"]);
    if (!options.config) throw new Error("check requires --config <path>");
    const result = await checkProjection({ configPath: options.config, packageRoot });
    process.stdout.write(`ui-design-brain: projection verified at ${result.targetPath} (${result.outputDigest})\n`);
    return;
  }

  throw new Error(`unknown command: ${command}\n${usage()}`);
}

run().catch((error) => {
  process.stderr.write(`ui-design-brain: ${error.message}\n`);
  process.exitCode = 1;
});
