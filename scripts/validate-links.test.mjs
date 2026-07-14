import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("validates internal SemVer routes instead of treating them as assets", () => {
  const cwd = join(tmpdir(), `phoxia-links-${process.pid}`);
  mkdirSync(join(cwd, "build"), { recursive: true });
  writeFileSync(join(cwd, "build", "index.html"), '<a href="/kit/releases/1.0.0">release</a>');

  const result = spawnSync(process.execPath, [fileURLToPath(new URL("./validate-links.mjs", import.meta.url))], { cwd, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /broken internal link \/kit\/releases\/1\.0\.0/);
});
