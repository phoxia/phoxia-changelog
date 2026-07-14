import release from "../../../content/releases/kit/1.0.0.json" with { type: "json" };
import type { Release } from "./types.ts";

const required = ["product", "version", "title", "date", "summary", "changes", "docsUrl", "sourceUrl", "breaking"] as const;
const allowed = new Set([...required, "compatibility", "migration", "rfcUrl"]);
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export function validateRelease(value: unknown): Release {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("release must be an object");
  const record = value as Record<string, unknown>;

  for (const key of required) {
    if (!(key in record)) throw new Error(`missing ${key}`);
  }
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) throw new Error(`unexpected ${key}`);
  }

  for (const key of ["product", "title", "summary"] as const) {
    if (typeof record[key] !== "string" || record[key].length === 0 || record[key].trim() !== record[key]) throw new Error(`invalid ${key}`);
  }
  if (typeof record.version !== "string" || !semver.test(record.version)) throw new Error("invalid version");
  if (typeof record.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(record.date) || new Date(`${record.date}T00:00:00Z`).toISOString().slice(0, 10) !== record.date) throw new Error("invalid date");
  if (!Array.isArray(record.changes) || record.changes.length === 0 || !record.changes.every((change) => typeof change === "string" && change.length > 0 && change.trim() === change)) throw new Error("invalid changes");
  if (typeof record.breaking !== "boolean") throw new Error("invalid breaking");

  for (const key of ["docsUrl", "sourceUrl", "rfcUrl"] as const) {
    if (record[key] !== undefined && !isHttpsUrl(record[key])) throw new Error(`unexpected ${key}`);
  }
  for (const key of ["compatibility", "migration"] as const) {
    if (record[key] !== undefined && (typeof record[key] !== "string" || record[key].length === 0 || record[key].trim() !== record[key])) throw new Error(`invalid ${key}`);
  }

  return record as unknown as Release;
}

export const releases: readonly Release[] = [validateRelease(release)];
export const releaseKey = (release: Release) => `${release.product}:${release.version}`;

function compareVersions(a: string, b: string): number {
  const [aCore, aPre] = a.split("+", 1)[0]!.split("-", 2);
  const [bCore, bPre] = b.split("+", 1)[0]!.split("-", 2);
  for (let index = 0; index < 3; index++) {
    const difference = Number(aCore!.split(".")[index]) - Number(bCore!.split(".")[index]);
    if (difference) return difference;
  }
  if (aPre === undefined || bPre === undefined) return aPre === bPre ? a.localeCompare(b) : aPre === undefined ? 1 : -1;
  const aParts = aPre.split(".");
  const bParts = bPre.split(".");
  for (let index = 0; index < Math.max(aParts.length, bParts.length); index++) {
    const left = aParts[index];
    const right = bParts[index];
    if (left === undefined || right === undefined) return left === right ? a.localeCompare(b) : left === undefined ? -1 : 1;
    if (left === right) continue;
    const leftNumber = /^\d+$/.test(left);
    const rightNumber = /^\d+$/.test(right);
    if (leftNumber && rightNumber) return Number(left) - Number(right);
    if (leftNumber !== rightNumber) return leftNumber ? -1 : 1;
    return left.localeCompare(right);
  }
  return a.localeCompare(b);
}

export function releaseState(items: readonly Release[]) {
  const latest = new Map<string, Release>();
  for (const item of items) {
    const current = latest.get(item.product);
    if (!current || item.date > current.date || (item.date === current.date && compareVersions(item.version, current.version) > 0)) latest.set(item.product, item);
  }
  const products = [...latest.values()].sort((a, b) => a.product.localeCompare(b.product)).map((item) => ({
    ...item,
    name: item.title.replace(new RegExp(`\\s+${item.version.replaceAll(".", "\\.")}$`), "")
  }));
  return { empty: products.length === 0, products };
}

export function getRelease(product: string, version: string): Release | undefined {
  return releases.find((item) => item.product === product && item.version === version);
}
