---
layout: component-docs
title: Icon
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { iconBasic, iconButton, iconPalette, iconSemantic, iconSizes, iconStatus, iconThemes } from '../../../../components/demos/icon'
</script>

## Usage

`Icon` draws one icon from an Iconify collection. Pass the name. You do not import an icon component for each glyph.

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

The name is `collection:icon`, the same id Iconify uses. `carbon-settings` is accepted too, once the `carbon` collection is registered. A collection whose own name contains a hyphen, such as `material-symbols`, should keep the colon: `material-symbols:home`.

Nothing in `@astryx-vue/core` bundles those drawings. Install the collection you actually use, then let the Vite plugin pull in only the icons your source names:

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

`astryxIcons()` reads `@iconify-json/*` from the project's dependencies. A static `name="carbon:settings"` becomes a tiny module that registers that one icon. The rest of the Carbon set stays out of the bundle. Another set is the same step: install `@iconify-json/lucide` and write `name="lucide:settings"`. UnoCSS is not involved.

The plugin can only see names written in source. When the name is chosen at runtime, register the collection yourself. That ships the whole set:

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

addCollection(carbon)
```

Call `addCollection` before the icon renders, usually from the app entry. `addIcon('carbon:settings', data)` registers a single icon the same way.

Leave `size` off and the icon is `1em` square, painted with `currentColor`, so it follows the text around it. [Button](/en/components/button)'s `icon` and `end` slots, [IconButton](/en/components/icon-button), and a field's start and end slots already size that box. Put `Icon` in the slot and do not set `size` again.

```vue
<Button label="Settings">
  <template #icon>
    <Icon name="carbon:settings" />
  </template>
</Button>
```

A decorative icon is `aria-hidden`. Set `label` only when the icon is the only thing that carries the meaning, and the parent control does not already have a name.

`icon` still accepts a CSS class or your own component. Navigation `iconClass` is still a class. Those paths do not require UnoCSS either.

## Semantic names

Inside the components, a name is the job, not a file in one collection. Search, close, check, and the downward chevron are that kind of name. Each one points at the Lucide icon that does the same job. Until that collection is registered, the built-in glyph stays, so the icon is not a blank box.

To change the set, point those names at Iconify ids on the theme. A theme that extends another one only lists the names it changes. A direct icon still uses `name`, and that wins over a semantic name.

```vue
<script setup lang="ts">
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
</script>

<template>
  <Theme
    :theme="defineTheme({
      name: 'withCarbon',
      icons: { search: 'carbon:search', close: 'carbon:close' },
    })"
  >
    <slot />
  </Theme>
</template>
```

The full list is on the props page. Read the current id with `useSemanticIcon`, exported from the same entry as `Icon`.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use one collection inside a view. Mixing outline and filled drawings in the same row makes the row look unfinished. |
| <Badge variant="success">Do</Badge> | Leave `size` unset inside a button or a field slot. The slot already decides the box, and `1em` fills it. |
| <Badge variant="success">Do</Badge> | Set `label` when the icon stands alone and nothing next to it says what it means. |
| <Badge variant="success">Do</Badge> | Install only the collections you reference. The plugin bundles the icons you name, not the whole set. |
| <Badge variant="error">Don't</Badge> | Import a component per icon. `name` is the API; the plugin does the lookup. |
| <Badge variant="error">Don't</Badge> | Set `label` on an icon inside a button or a link that already has a name. The name would be announced twice. |
| <Badge variant="error">Don't</Badge> | Rely on a name that is concatenated at runtime without `addCollection` or `addIcon`. The plugin never sees it, and the icon renders empty. |

## Examples

<DemoExample
  :demo="iconBasic"
  description="carbon:search at the md size, then the same settings icon with no size, sitting in body text and in large text. Omit size when the icon should match the line."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="iconSizes"
  description="xsm is 12px, sm is 16px, md is 20px, and lg is 24px, at a 16px root."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="iconSemantic"
  description="Semantic colors. primary, secondary, tertiary, and disabled follow the text ramp. accent, success, error, and warning carry meaning."
  locale="en"
  title="Semantic colors"
/>

<DemoExample
  :demo="iconPalette"
  description="Palette colors for grouping. They do not report status."
  locale="en"
  title="Palette"
/>

<DemoExample
  :demo="iconStatus"
  description="A status line keeps the icon and a text label. The icon is decorative because the text already says what happened."
  locale="en"
  title="Status"
/>

<DemoExample
  :demo="iconButton"
  description="Icon in a Button start slot, a Button end slot, an IconButton, and a text field's start and end slots. No size is set; each slot owns the box."
  locale="en"
  title="In a button"
/>

<DemoExample
  :demo="iconThemes"
  description="The same semantic names. The first row is the built-in glyphs. The next two rows point search, close, check, and the downward chevron at Carbon and Heroicons."
  locale="en"
  title="Swap the drawings with the theme"
/>

## Accessibility

- With no `label`, the root is `aria-hidden="true"`. The SVG is hidden as well.
- A non-empty `label` sets `role="img"` and `aria-label`, and removes `aria-hidden`. Use it for a status glyph that has no adjacent text.
- An empty `label` stays decorative.
- Do not set `label` when a parent button or link already names the control.
- The drawing uses `currentColor`. A color that is only a hex on the element will not follow the theme; use the `color` prop.
