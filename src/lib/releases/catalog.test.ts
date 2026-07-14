import assert from "node:assert/strict";
import test from "node:test";
import { getRelease, releases, releaseState, validateRelease } from "./catalog.ts";

test("rejects a release without evidence", () => {
  assert.throws(() => validateRelease({ product: "kit", version: "1.0.0" }), /title/);
});

test("rejects private RFC relationships", () => {
  assert.throws(() => validateRelease({
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: [], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false,
    rfcUrl: "private://vault/1"
  }), /unexpected rfcUrl/);
});

test("rejects malformed metadata and unexpected keys", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: [], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  assert.throws(() => validateRelease({ ...valid, version: "v1" }), /version/);
  assert.throws(() => validateRelease({ ...valid, date: "2026-02-30" }), /date/);
  assert.throws(() => validateRelease({ ...valid, docsUrl: "http://docs.phoxia.org/kit" }), /docsUrl/);
  assert.throws(() => validateRelease({ ...valid, privateNote: "secret" }), /unexpected privateNote/);
});

test("rejects non-canonical semantic versions", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: [], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const version of ["01.0.0", "1.0.0-..", "1.0.0-01"]) {
    assert.throws(() => validateRelease({ ...valid, version }), /version/);
  }
});

test("rejects malformed HTTPS URLs and URLs without a hostname", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: [], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const docsUrl of ["not a URL", "http://docs.phoxia.org/kit", "https://"]) {
    assert.throws(() => validateRelease({ ...valid, docsUrl }), /docsUrl/);
  }
});

test("exposes exactly the verified Kit release", () => {
  assert.equal(releases.length, 1);
  assert.equal(getRelease("kit", "1.0.0")?.title, "Phoxia DevKit 1.0.0");
  assert.equal(getRelease("kit", "9.9.9"), undefined);
});

test("describes an empty catalog without indexing a missing release", () => {
  assert.deepEqual(releaseState([]), { empty: true, products: [] });
});

test("derives product labels from release titles", () => {
  assert.equal(releaseState(releases).products[0]?.name, "Phoxia DevKit");
});
