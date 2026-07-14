import assert from "node:assert/strict";
import test from "node:test";
import { getRelease, releaseKey, releases, releaseState, sortReleases, validateRelease } from "./catalog.ts";

test("rejects a release without evidence", () => {
  assert.throws(() => validateRelease({ product: "kit", version: "1.0.0" }), /title/);
});

test("rejects private RFC relationships", () => {
  assert.throws(() => validateRelease({
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false,
    rfcUrl: "private://vault/1"
  }), /unexpected rfcUrl/);
});

test("rejects malformed metadata and unexpected keys", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  assert.throws(() => validateRelease({ ...valid, version: "v1" }), /version/);
  assert.throws(() => validateRelease({ ...valid, date: "2026-02-30" }), /date/);
  assert.throws(() => validateRelease({ ...valid, docsUrl: "http://docs.phoxia.org/kit" }), /docsUrl/);
  assert.throws(() => validateRelease({ ...valid, changes: [] }), /changes/);
  assert.throws(() => validateRelease({ ...valid, privateNote: "secret" }), /unexpected privateNote/);
});

test("rejects non-canonical semantic versions", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const version of ["01.0.0", "1.0.0-..", "1.0.0-01"]) {
    assert.throws(() => validateRelease({ ...valid, version }), /version/);
  }
});

test("rejects malformed HTTPS URLs and URLs without a hostname", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const docsUrl of ["not a URL", "http://docs.phoxia.org/kit", "https://"]) {
    assert.throws(() => validateRelease({ ...valid, docsUrl }), /docsUrl/);
  }
});

test("rejects blank or untrimmed release strings", () => {
  const valid = {
    product: "kit", version: "1.0.0", title: "Kit 1.0", date: "2026-07-13",
    summary: "Initial public release", changes: ["Added release"], docsUrl: "https://docs.phoxia.org/kit",
    sourceUrl: "https://github.com/phoxia/phoxia-devkit", breaking: false
  };

  for (const record of [
    { ...valid, title: "   " },
    { ...valid, summary: " Release " },
    { ...valid, changes: [" "] },
    { ...valid, docsUrl: " https://docs.phoxia.org/kit" },
    { ...valid, compatibility: "" },
    { ...valid, migration: "   " }
  ]) assert.throws(() => validateRelease(record));
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

test("keeps only the latest release for each product", () => {
  const older = { ...releases[0]!, version: "1.9.0", date: "2026-07-13", title: "Phoxia DevKit 1.9.0" };
  const newer = { ...releases[0]!, version: "2.0.0", date: "2026-07-13", title: "Phoxia DevKit 2.0.0" };

  assert.deepEqual(releaseState([older, newer]).products.map(({ product, version }) => ({ product, version })), [
    { product: "kit", version: "2.0.0" }
  ]);
});

test("prefers release date before semantic version", () => {
  const newerDate = { ...releases[0]!, version: "1.0.0", date: "2026-07-13" };
  const olderDate = { ...releases[0]!, version: "9.0.0", date: "2026-07-12" };

  assert.equal(releaseState([newerDate, olderDate]).products[0]?.version, "1.0.0");
});

test("keys equal versions from different products separately", () => {
  const kit = releases[0]!;
  const other = { ...kit, product: "other" };

  assert.deepEqual([releaseKey(kit), releaseKey(other)], ["kit:1.0.0", "other:1.0.0"]);
});

test("orders releases newest-first by date then semantic version", () => {
  const base = releases[0]!;
  const items = [
    { ...base, version: "2.0.0", date: "2026-07-12" },
    { ...base, version: "1.1.0", date: "2026-07-13" },
    { ...base, version: "1.2.0", date: "2026-07-13" }
  ];
  assert.deepEqual(sortReleases(items).map(({ version }) => version), ["1.2.0", "1.1.0", "2.0.0"]);
});
