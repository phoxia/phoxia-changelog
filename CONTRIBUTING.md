# Contributing

Keep the public changelog aligned with released products.

- Every public version change requires a validated `content/releases/<product>/<version>.json` record in the same change.
- Changes to user-visible behavior or public contracts also require the corresponding Phoxia Docs update.
- Use only public evidence. Do not add private paths, internal notes, unpublished RFC relationships or speculative release data.

Before submitting a change, run:

```sh
npm test
npm run check
npm run build
node scripts/check-version-record.mjs /path/to/public/MANIFEST.json <product>
npx playwright test
```
