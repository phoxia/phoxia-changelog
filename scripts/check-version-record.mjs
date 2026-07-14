#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRelease } from "../src/lib/releases/catalog.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function hasReleaseRecord(manifest, product, candidate) {
  if (!manifest || typeof manifest.version !== "string" || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(manifest.version) || typeof product !== "string" || !/^[a-z0-9-]+$/.test(product)) return false;
  try {
    const record = validateRelease(candidate ?? JSON.parse(readFileSync(resolve(root, "content", "releases", product, `${manifest.version}.json`), "utf8")));
    return record.product === product && record.version === manifest.version;
  } catch {
    return false;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , manifestPath, product] = process.argv;
  const path = resolve(manifestPath ?? "");
  let source;
  try { source = readFileSync(path, "utf8"); } catch {
    console.error(`Unable to read manifest ${path}`);
    process.exitCode = 1;
  }
  let manifest;
  if (source !== undefined) try { manifest = JSON.parse(source); } catch {
    console.error(`Invalid manifest ${path}`);
    process.exitCode = 1;
  }
  if (manifest !== undefined && !hasReleaseRecord(manifest, product)) {
    console.error(`Missing changelog record for ${product ?? "product"} ${manifest?.version ?? "version"}`);
    process.exitCode = 1;
  }
}
