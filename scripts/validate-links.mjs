#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const files = readdirSync("build", { recursive: true }).filter((file) => file.endsWith(".html"));
for (const file of files) {
  const html = readFileSync(join("build", file), "utf8");
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = href.split(/[?#]/)[0];
    if (existsSync(`build${path}`)) continue;
    const target = path === "/" ? "build/index.html" : `build${path}.html`;
    if (!existsSync(target)) throw new Error(`${file}: broken internal link ${href}`);
  }
}
console.log(`Validated links in ${files.length} prerendered pages.`);
