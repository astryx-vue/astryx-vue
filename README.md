English | [简体中文](./README.zh-CN.md)

# astryx-vue

An unofficial Vue 3 community implementation of the Astryx design system.

[![GitHub](https://img.shields.io/badge/GitHub-astryx--vue%2Fastryx--vue-181717?logo=github)](https://github.com/astryx-vue/astryx-vue)
[![npm @astryx-vue/core](https://img.shields.io/npm/v/@astryx-vue/core?label=%40astryx-vue%2Fcore)](https://www.npmjs.com/package/@astryx-vue/core)
[![npm @astryx-vue/themes](https://img.shields.io/npm/v/@astryx-vue/themes?label=%40astryx-vue%2Fthemes)](https://www.npmjs.com/package/@astryx-vue/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> This project is not an official Meta project. The original Astryx is at <https://github.com/facebook/astryx>.

## Features

- A native Vue 3 API: props, events, slots, `v-model`, and composables.
- Components and themes ship separately: `@astryx-vue/core` provides the components, and `@astryx-vue/themes` provides the themes.
- Built with CSS variables and CSS cascade layers. UnoCSS and StyleX are not required.
- Interactive documentation, with component examples, Chinese and English pages, and a theme playground.
- Complete TypeScript types, with Vitest tests.

## Install

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

Documentation site: <https://astryx-vue.pages.dev>

The first npm release was `0.1.0`. Release steps are in [RELEASING.md](./RELEASING.md).

## Quick start

Import the theme once at the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

The monospace font stack is JetBrains Mono. Importing the Neutral theme also loads weights 400, 500, 600, and 700, plus 400 italic.

Then use it from a component:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Get started" />
</template>
```

## Documentation

Online docs: <https://astryx-vue.pages.dev>

Playground: <https://astryx-vue.pages.dev/playground/> (English: <https://astryx-vue.pages.dev/en/playground/>)

Start the docs site locally:

```sh
pnpm install
pnpm dev
```

## Development

Node.js 22.18+ and pnpm 11.21+ are required.

```sh
pnpm install
pnpm check   # lint + typecheck + test + build
```

## License

[MIT](./LICENSE)
