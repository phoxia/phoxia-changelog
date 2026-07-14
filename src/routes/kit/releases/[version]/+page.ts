import { error } from "@sveltejs/kit";
import { getRelease, releases } from "$lib/releases/catalog";

export const entries = () => releases.filter(({ product }) => product === "kit").map(({ version }) => ({ version }));

export function load({ params }) {
  const release = getRelease("kit", params.version);
  if (!release) error(404, "Release not found");
  return { release };
}
