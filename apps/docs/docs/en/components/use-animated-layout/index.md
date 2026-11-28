---
layout: component-docs
title: useAnimatedLayout
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAnimatedLayoutFileTree } from '../../../../components/demos/use-animated-layout'
</script>

## Usage

When a component grows or shrinks (a folder in a tree opens, say), the content after it jumps to its new place. `useAnimatedLayout` makes that content glide there instead.

Hand `useAnimatedLayout` a container (a scroll area or a panel) and get a handle back, then pass the handle to the `animatedLayout` prop of the component whose size changes.

```ts
import { useAnimatedLayout } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAnimatedLayout } from '@astryx-vue/core'
import { TreeList } from '@astryx-vue/core/TreeList'
import { useTemplateRef } from 'vue'

const panel = useTemplateRef<HTMLElement>('panel')
const animatedLayout = useAnimatedLayout({ containerRef: panel })
</script>

<template>
  <div ref="panel">
    <TreeList :items="items" :animated-layout="animatedLayout" />
    <p>Notes</p>
  </div>
</template>
```

When the component's size changes, the content after it in the container glides to its new place together, on the theme's move duration and curve. Revealed content slides in from its edge; hidden content slides out and gives up its space before it goes. The disclosure chevron turns on the same timing.

`Collapsible`, `List`, `TreeList`, and the `animatedLayout` option of `useTableRowExpansion` take the handle today.

- Only the content after the changed component, inside the container, moves. Content outside the container lands at once.
- Fixed elements and stuck sticky elements stay put, and the glide never scrolls the container.
- Changes in one container in one frame move as one glide.
- With Reduce Motion on, a touch screen gets a short cross-fade instead, and a mouse lands at once.
- The handle is created once and reads the container when a change happens, so the ref can point somewhere else later. It touches no DOM during server rendering.

## Guidelines

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the block that actually gets pushed around as the container: a sidebar, a card, or a scroll area. |
| <Badge variant="success">Do</Badge> | Share one handle among the components in one container, so their changes glide together. |
| <Badge variant="error">Don't</Badge> | Use the whole page as the container: everything below a change glides with it, which is too loud. |

## Examples

<DemoExample
  :demo="useAnimatedLayoutFileTree"
  description="Open or close a folder, or the notes below it, and the content after it glides to its new place."
  locale="en"
  title="useAnimatedLayout — File tree"
/>
