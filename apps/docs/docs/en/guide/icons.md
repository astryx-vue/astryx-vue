---
title: Icons
---

# Icons

Draw an icon with `Icon` and an Iconify name. You do not import a component for each glyph.

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

`carbon:settings` is the Carbon collection's settings icon. `carbon-settings` is the same name once that collection is registered. A collection id that already contains a hyphen keeps the colon, as in `material-symbols:home`.

## Bundle only the icons you name

`@astryx-vue/core` does not include a collection. Install the one you want, and add the Vite plugin:

```bash
pnpm add -D @iconify-json/carbon
```

```ts
import { astryxIcons } from '@astryx-vue/core/icons'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), astryxIcons()],
})
```

The plugin looks at `@iconify-json/*` in the nearest `package.json`. It scans source for static names and emits a module per icon, so the client bundle contains those drawings and not the rest of the JSON. If the Vite root has no `package.json` — VitePress points its root at the docs directory — the plugin walks up until it finds one. A second collection is another package: install `@iconify-json/lucide` and write `name="lucide:settings"`. You do not need UnoCSS for this.

Pass `collections: ['carbon']` when you want the plugin to ignore every other installed set.

## Names that are not written in source

The plugin cannot see a name built at runtime. Register the collection in the app entry, before anything renders. This includes the whole set in the bundle:

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

addCollection(carbon)
```

`addIcon('carbon:settings', data)` registers one icon when you already have its Iconify body.

## Slots

With no `size`, the icon is `1em` and uses `currentColor`. Button's `icon` and `end` slots, IconButton, and a field's start and end slots already size the box, so the icon fills it:

```vue
<Button label="Settings">
  <template #icon>
    <Icon name="carbon:settings" />
  </template>
</Button>

<IconButton label="Search">
  <Icon name="carbon:search" />
</IconButton>
```

A decorative icon is hidden from assistive technology. Set `label` only when the icon itself is the message. The component page has the sizes, colors, and slot examples.

## CSS classes

`icon` still accepts a CSS class, and so does `iconClass` on navigation and menu items. A class only draws something if your build generates it. UnoCSS is one way to do that. It is what the docs site uses for older examples. An application does not have to use it.

The glyphs the components draw themselves (`chevronDown`, `check`, and the rest) are not a general icon set. Use `name` for product icons.
