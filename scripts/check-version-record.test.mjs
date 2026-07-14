import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { hasReleaseRecord } from "./check-version-record.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const script = resolve(root, "scripts/check-version-record.mjs");
const devkitManifest = resolve(root, "../phoxia-kits/devkit/MANIFEST.json");

test("requires a record for the manifest version", () => {
  assert.equal(hasReleaseRecord({ version: "1.0.0" }, "kit"), true);
  assert.equal(hasReleaseRecord({ version: "9.9.9" }, "kit"), false);
});

test("rejects a record for another product or malformed manifest", () => {
  assert.equal(hasReleaseRecord({ version: "1.0.0" }, "other"), false);
  assert.equal(hasReleaseRecord({}, "kit"), false);
  assert.equal(hasReleaseRecord({ version: "../1.0.0" }, "kit"), false);
  assert.equal(hasReleaseRecord({ version: "1.0.0" }, "kit/../kit"), false);
});

test("uses the canonical release validation contract", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0.0", date: "2026-07-13",
    summary: "Release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const record of [
    { ...valid, version: "01.0.0" },
    { ...valid, date: "2026-02-30" },
    { ...valid, docsUrl: "http://docs.phoxia.org/kit" },
    { ...valid, changes: [] },
    { ...valid, title: "" },
    { ...valid, privatePath: "/private/release" }
  ]) assert.equal(hasReleaseRecord({ version: "1.0.0" }, "kit", record), false);
});

test("CLI succeeds for the real DevKit manifest from another cwd", () => {
  const cwd = mkdtempSync(resolve(tmpdir(), "changelog-gate-"));
  try {
    const result = spawnSync(process.execPath, [script, devkitManifest, "kit"], { cwd, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});

test("CLI reports an absent product and release exactly", () => {
  const cwd = mkdtempSync(resolve(tmpdir(), "changelog-gate-"));
  const missingManifest = resolve(cwd, "manifest.json");
  writeFileSync(missingManifest, JSON.stringify({ version: "9.9.9" }));
  try {
    for (const [manifest, product, message] of [
      [devkitManifest, "missing", "Missing changelog record for missing 1.0.0\n"],
      [missingManifest, "kit", "Missing changelog record for kit 9.9.9\n"]
    ]) {
      const result = spawnSync(process.execPath, [script, manifest, product], { cwd, encoding: "utf8" });
      assert.equal(result.status, 1);
      assert.equal(result.stderr, message);
    }
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
