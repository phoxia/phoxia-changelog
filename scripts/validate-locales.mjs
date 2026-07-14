#!/usr/bin/env node
import { readFileSync } from "node:fs";

for (const file of ["build/pt-BR.html", "build/pt-BR/kit.html"]) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('<html lang="pt-BR">')) throw new Error(`${file}: missing pt-BR lang attribute`);
  if (html.includes("ainda nao esta disponivel")) throw new Error(`${file}: untranslated fallback notice still present`);
}
console.log("Validated pt-BR locale shells.");
