import icon192 from "@phoxia/lux/assets/favicon/icon-192.png?url";
import icon512 from "@phoxia/lux/assets/favicon/icon-512.png?url";
import maskable192 from "@phoxia/lux/assets/favicon/maskable-192.png?url";
import maskable512 from "@phoxia/lux/assets/favicon/maskable-512.png?url";

export const prerender = true;

export function GET() {
  return Response.json({
    name: "Phoxia Changelog",
    short_name: "Changelog",
    start_url: "/",
    display: "standalone",
    background_color: "#080914",
    theme_color: "#080914",
    icons: [
      { src: icon192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icon512, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: maskable192, sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: maskable512, sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, { headers: { "content-type": "application/manifest+json" } });
}
