---
title: Why
---

# Why

astryx-vue reimplements the [Astryx](https://github.com/facebook/astryx) design language in Vue 3. The upstream docs are at <https://astryx.atmeta.com>. That project is React 19 and StyleX. This repository is an unofficial community project. It is not a Meta project, and it does not claim the React version's capabilities as its own.

What is worth matching is the design language, not the framework. The port concentrates on four things: design tokens, CSS variables, the motion system, and the grain of the components. The API is Vue: props, events, slots, `v-model`, and composables. There is no React adapter, and the public packages do not depend on anything that would pull React into the tree.

Components and themes are two packages. `@astryx-vue/core` ships the components and the structural styles. `@astryx-vue/themes` ships the themes. The styles are plain CSS. You do not install UnoCSS or StyleX to use them.

Icons are not a built-in icon set. Components that need an icon take a CSS class, and the caller draws it. The docs site uses Anthony Fu's CSS icon approach, UnoCSS `presetIcons`. The library itself keeps only a few decorative glyphs, such as the check, the chevrons, and copy. See [Icons](/en/guide/icons).

Surfaces that belong together are provided as a set of components, not as one flattened list of buttons. The set that exists today is `Chat`, `Citation`, and `Markdown`. See [Patterns](/en/guide/patterns).

The public API is whatever the repository exports. The only theme is Neutral. There is no upstream CLI, no StyleX `xstyle`, and no butter or other theme package.
