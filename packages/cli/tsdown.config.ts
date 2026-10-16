import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22.18',
  // Keep `.js` / `.d.ts` so the package exports match the rest of the repo.
  // Node platform otherwise forces `.mjs`.
  fixedExtension: false,
  clean: true,
  dts: true,
  deps: {
    neverBundle: [/^node:/],
  },
})
