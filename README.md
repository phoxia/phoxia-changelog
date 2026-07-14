# Phoxia Changelog

Public release history for the [Phoxia](https://github.com/phoxia) ecosystem. A static, prerendered catalog tracking every published version across Phoxia products, newest first.

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](./LICENSE)

## How it works

Each Phoxia product publishes a [MANIFEST.json](https://github.com/phoxia/phoxia-devkit) with its current version. A CI gate enforces that every public version change has a matching release record in this catalog before the release ships. The site is built from validated JSON records under `content/releases/` and deployed as a fully static site.

## Quick start

```bash
npm install
npm run dev       # dev server at localhost:5173
npm run verify    # full pipeline: test + check + build + validate
```

## Scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm test` | Unit tests (catalog validation, version records, link checks) |
| `npm run check` | TypeScript + Svelte diagnostics |
| `npm run build` | Prerender the static site to `build/` |
| `npm run preview` | Preview the built output locally |
| `npm run validate:links` | Verify every internal link resolves to a built file |
| `npm run validate:locales` | Confirm locale pages have correct `lang` attributes |
| `npm run validate:public` | Scan for private boundary violations before deploy |
| `npm run verify` | Run everything: test + check + build + all validators + e2e |

## Adding a release

1. Create a JSON file at `content/releases/<product>/<version>.json` following the release schema.
2. Run `npm run verify` to confirm the record passes validation, link checks, and locale checks.
3. Open a PR. The CI gate in the product's own repo will reference this record.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full release record schema.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
