import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => event.url.pathname.startsWith("/pt-BR") ? html.replace('<html lang="en">', '<html lang="pt-BR">') : html
});
