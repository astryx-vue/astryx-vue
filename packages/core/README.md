# @astryx-vue/core

Vue 3 components for [astryx-vue](https://github.com/astryx-vue/astryx-vue), an unofficial port of Astryx. Not affiliated with Meta.

> **Using an agent?** Install `@astryx-vue/cli` and run `astryx-vue component Button`, or `astryx-vue init --features agents` so the agent looks components up instead of guessing. The binary is `astryx-vue`, not `astryx`.

## Install

```sh
pnpm add @astryx-vue/core @astryx-vue/themes
```

Peer dependency: `vue` `^3.5.0`.

## Use

Import a theme once at the app entry, then import the component you need from its subpath. The subpath loads that component's structural styles. You do not need StyleX or UnoCSS.

```ts
import '@astryx-vue/themes/neutral.css'
```

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Save changes" variant="primary" />
</template>
```

Prefer a subpath such as `@astryx-vue/core/Button` over the package root. The root re-exports the same components, and a bundler that keeps unused re-exports can pull in more than you asked for. Import `@astryx-vue/core/styles.css` only when you want every structural sheet in one file.

Props, slots, and events are on the docs site, or:

```sh
npx @astryx-vue/cli component Button
```

## Related packages

| Package | What it is |
| --- | --- |
| `@astryx-vue/themes` | Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K |
| `@astryx-vue/cli` | `astryx-vue` for component docs, search, and agent context |

## Resources

- [Documentation](https://astryx-vue.pages.dev/en/components/)
- [CLI guide](https://astryx-vue.pages.dev/en/guide/cli)
- [Repository](https://github.com/astryx-vue/astryx-vue)

## License

MIT. Astryx is copyright Meta Platforms, Inc. This package is an unofficial port and is not affiliated with or endorsed by Meta.
