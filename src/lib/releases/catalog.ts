import release from "../../../content/releases/kit/1.0.0.json" with { type: "json" };
import type { Release } from "./types.ts";

const required = ["product", "version", "title", "date", "summary", "changes", "docsUrl", "sourceUrl", "breaking"] as const;
const allowed = new Set([...required, "compatibility", "migration", "rfcUrl"]);

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
    if (typeof record[key] !== "string" || record[key].length === 0) throw new Error(`invalid ${key}`);
  }
  if (typeof record.version !== "string" || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(record.version)) throw new Error("invalid version");
  if (typeof record.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(record.date) || new Date(`${record.date}T00:00:00Z`).toISOString().slice(0, 10) !== record.date) throw new Error("invalid date");
  if (!Array.isArray(record.changes) || !record.changes.every((change) => typeof change === "string" && change.length > 0)) throw new Error("invalid changes");
  if (typeof record.breaking !== "boolean") throw new Error("invalid breaking");

  for (const key of ["docsUrl", "sourceUrl", "rfcUrl"] as const) {
    if (record[key] !== undefined && (typeof record[key] !== "string" || !record[key].startsWith("https://"))) throw new Error(`unexpected ${key}`);
  }
  for (const key of ["compatibility", "migration"] as const) {
    if (record[key] !== undefined && typeof record[key] !== "string") throw new Error(`invalid ${key}`);
  }

  return record as unknown as Release;
}

export const releases: readonly Release[] = [validateRelease(release)];

export function getRelease(product: string, version: string): Release | undefined {
  return releases.find((item) => item.product === product && item.version === version);
}
