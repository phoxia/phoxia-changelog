#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

for (const root of ["content", "build"]) for (const file of readdirSync(root, { recursive: true })) {
  const path = join(root, file);
  if (!/\.(?:html|json)$/.test(file)) continue;
  if (/(?:private:\/\/|\/vault\b|employer)/i.test(readFileSync(path, "utf8"))) throw new Error(`${path}: private boundary violation`);
}
console.log("Validated public content boundary.");
