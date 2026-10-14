---
title: Installation
---

# Installation

Install the two public packages together:

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

```sh
npm install @astryx-vue/core @astryx-vue/themes
```

```sh
yarn add @astryx-vue/core @astryx-vue/themes
```

`@astryx-vue/core` peers on `vue: ^3.5.0`. The theme package depends on `@fontsource/figtree` and `@fontsource/jetbrains-mono` for the body and monospace faces. Both packages publish ESM only.

Entries differ by what you need:

| You need | Import |
| --- | --- |
| One component | A subpath such as `@astryx-vue/core/Button` |
| Composables, and components re-exported from the root | `@astryx-vue/core` |
| `provideAstryxLocale`, `useAstryxMessages` | `@astryx-vue/core/locale`, also on the root |
| A theme | `@astryx-vue/themes/neutral.css`. Butter, Chocolate, Gothic, Matcha, Stone, and Y2K use the same path with their own file name. |
| Every structural sheet | `@astryx-vue/core/styles.css` |
| The layer declaration | `@astryx-vue/core/reset.css` |

`reset.css` is currently just `@layer astryx.reset;`. It is not a browser reset. The structural sheets and the theme declare the layer order themselves.

Subpaths and the package root export the same components. Docs and examples use subpaths so the import says which component it is, and so only that component's structural sheet loads. Importing `useClipboard` from the package root can pull other component modules along if the bundler does not drop unused re-exports. Prefer a subpath when you only need a component.

The two packages version together. The published release is `0.1.0`. See the [changelog](/en/guide/changelog).
