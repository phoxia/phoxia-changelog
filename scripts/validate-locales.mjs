#!/usr/bin/env node
import { readFileSync } from "node:fs";

for (const file of ["build/pt-BR.html", "build/pt-BR/kit.html"]) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('<html lang="pt-BR">') || !html.includes('role="status"')) throw new Error(`${file}: incomplete pt-BR fallback shell`);
}
console.log("Validated pt-BR fallback shells.");
