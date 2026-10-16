English | [简体中文](./README.zh-CN.md)

# astryx-vue

Unofficial Vue 3 port of Astryx — components, themes, and an agent-friendly CLI.

[![GitHub](https://img.shields.io/badge/GitHub-astryx--vue%2Fastryx--vue-181717?logo=github)](https://github.com/astryx-vue/astryx-vue)
[![npm @astryx-vue/core](https://img.shields.io/npm/v/@astryx-vue/core?label=%40astryx-vue%2Fcore)](https://www.npmjs.com/package/@astryx-vue/core)
[![npm @astryx-vue/themes](https://img.shields.io/npm/v/@astryx-vue/themes?label=%40astryx-vue%2Fthemes)](https://www.npmjs.com/package/@astryx-vue/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> Not affiliated with, endorsed by, or supported by Meta. The original Astryx is at <https://github.com/facebook/astryx>.

## Install

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

The only peer dependency is `vue` `^3.5.0`. npm and yarn use the same package names.

## Quick start

Import one theme at the app entry. Neutral also applies on `:root`, and it brings Figtree and JetBrains Mono.

```ts
import '@astryx-vue/themes/neutral.css'
```

Import each component from its own subpath. That entry loads the matching structural styles. StyleX and UnoCSS are not required.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Get started" />
</template>
```

## Packages

| Package | What it is |
| --- | --- |
| [`@astryx-vue/core`](./packages/core) | Vue components, composables, and structural styles |
| [`@astryx-vue/themes`](./packages/themes) | One theme package: Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K |
| [`@astryx-vue/cli`](./packages/cli) | `astryx-vue` — component docs, search, and agent context. Not Meta's `astryx` |

`core` and `themes` publish together. The CLI is in this repository and publishes with a later release.

## CLI

Add the CLI as a dev dependency and call it through a project script:

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
npm run astryx-vue -- search dialog
npm run astryx-vue -- manifest --json
npm run astryx-vue -- init --features agents
```

`init --features agents` refreshes only the managed block in `AGENTS.md`. Text outside the markers stays. The guide is [CLI](https://astryx-vue.pages.dev/en/guide/cli).

## Resources

- Docs: <https://astryx-vue.pages.dev> (English: <https://astryx-vue.pages.dev/en/>)
- Playground: <https://astryx-vue.pages.dev/playground/> (English: <https://astryx-vue.pages.dev/en/playground/>)
- Components: <https://astryx-vue.pages.dev/en/components/>
- Themes: <https://astryx-vue.pages.dev/en/themes/>

## Development

Node.js 22.18+ and pnpm 11.21+.

```sh
pnpm install
pnpm dev      # docs site
pnpm check    # lint, typecheck, test, and build
```

Release steps are in [RELEASING.md](./RELEASING.md).

## License

[MIT](./LICENSE). Astryx is copyright Meta Platforms, Inc. This repository is an unofficial port of that design and is not affiliated with or endorsed by Meta.
