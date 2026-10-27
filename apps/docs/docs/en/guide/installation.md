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
| A global reset | `@astryx-vue/core/reset.css` |

`reset.css` is a global reset in the same family as Tailwind Preflight. Once imported, it changes the default look of plain HTML tags on the whole page:

- Every element is `box-sizing: border-box`, and borders start as 0-width solid lines.
- Headings, paragraphs, lists and similar tags lose their default margin and padding. Lists lose their bullets, and headings inherit their size and weight.
- Images, video and `svg` become block-level. `img` and `video` fit their container's width.
- Form controls inherit the font and color. Buttons lose the browser's own look.
- Disabled elements show the default pointer, not `not-allowed`.
- `::before`, `::after`, placeholders and the search field's clear button are reset too.

Every rule sits in the lowest layer, `astryx.reset`, with zero specificity, so any other layer and any unlayered style of yours overrides it. The file also declares the layer order itself, so the import order does not matter.

The reset is global by design. To keep your own page untouched, do not import `reset.css`. The components still work without it, because each structural sheet styles its own elements. The structural sheets and the theme declare the layer order themselves.

Subpaths and the package root export the same components. Docs and examples use subpaths so the import says which component it is, and so only that component's structural sheet loads. Importing `useClipboard` from the package root can pull other component modules along if the bundler does not drop unused re-exports. Prefer a subpath when you only need a component.

The two packages version together. The published release is `0.3.0`. See the [changelog](/en/guide/changelog) for what changed, and the [upgrade guide](/en/guide/migration) for what to do when you upgrade.

To look these docs up from the terminal, see [CLI](/en/guide/cli).
