import assert from "node:assert/strict";
import test from "node:test";
import { hasReleaseRecord } from "./check-version-record.mjs";

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
