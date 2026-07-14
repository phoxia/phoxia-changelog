import { error } from "@sveltejs/kit";
import { getRelease, releases } from "$lib/releases/catalog";

export const entries = () => releases.map(({ product, version }) => ({ path: `${product}/releases/${version}` }));

export function load({ params }) {
  const match = /^([^/]+)\/releases\/([^/]+)$/.exec(params.path);
  const release = match && getRelease(match[1]!, match[2]!);
  if (!release) error(404, "Page not found");
  return { release };
}
