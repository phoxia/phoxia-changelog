import { catalogFromModules } from "./catalog-core.ts";
export { releaseKey, releaseState } from "./catalog-core.ts";

export const releases = catalogFromModules(import.meta.glob("../../../content/releases/**/*.json", { eager: true }));

export function getRelease(product: string, version: string) {
  return releases.find((release) => release.product === product && release.version === version);
}
