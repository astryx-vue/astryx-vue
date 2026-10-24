---
layout: component-docs
title: useScrollableArea
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Adds canonical axis-aware scroll behavior to structure owned by the caller. An axis is effective only when its computed overflow is scroll-capable and geometry exceeds the shared 1px tolerance. Both viewport and content boxes are observed.

Bind `viewport` to the scrolling box as a function ref, and `content` to the box your content sits in. `viewportAttrs` carries `role`, `aria-label`, `tabindex`, and the `data-scroll-*` attributes written from the current measurement. `viewportStyle` carries `overflow` and `overscroll-behavior`. Name and role come from `label` and `role`, or from `keyboardAccess`, which also says where the keyboard enters. The measured state is registered as a scroll owner, so nested areas and focus delegation can tell which level scrolls. A hidden or zero-size viewport cannot be measured and keeps its last state. Options are read reactively, so a component's `props` object can be passed straight in and later changes are picked up.

```ts
import { useScrollableArea } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useScrollableArea } from '@astryx-vue/core'

const { content, viewport, viewportAttrs, viewportStyle } = useScrollableArea({
  axis: 'block',
  label: 'Release notes',
})
</script>

<template>
  <div :ref="viewport" v-bind="viewportAttrs" :style="viewportStyle">
    <div :ref="content">
      Long content
    </div>
  </div>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Bind both `viewport` and `content`. A real observed content box is required for live overflow changes. |
| <Badge variant="success">Do</Badge> | Give the area a concise `label`. The viewport enters the tab order only while it actually scrolls. |
| <Badge variant="success">Do</Badge> | Use `axis` for the direction you intend to scroll, and `both` only when the content really scrolls two ways. |
| <Badge variant="success">Do</Badge> | Keep `overscroll` at `allow` unless a finished gesture should stop at this box. |
| <Badge variant="error">Don't</Badge> | Write your own `overflow` on the viewport; `viewportStyle` picks `clip` or `auto` from the measurement. |
| <Badge variant="error">Don't</Badge> | Wrap it in another overflow container. One viewport should own the scroll. |
