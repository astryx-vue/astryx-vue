---
layout: component-docs
title: Center
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { centerAxes, centerBasic, centerInline, centerPadding } from '../../../../components/demos/center'
</script>

## Usage

`Center` puts its content in a flex container and aligns it to the middle of that box on one axis or on both. It is layout only: it paints nothing, draws no border, and adds no role or accessible name to the content, so empty states, loading screens, and login forms all fit without any extra markup.

By default it centers on both axes:

```vue
<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <Center :height="200">
    <p>Nothing here yet</p>
  </Center>
</template>
```

Everything in the slot is centered as one block: `Center` never distributes space between several children. When you need to arrange multiple items along a direction, use `Stack` instead.

`axis` selects which axis is centered. `both` (the default) centers the main and the cross axis, `horizontal` centers the inline direction only, and `vertical` centers the block direction only. The two single-axis values are named after horizontal writing; they end up on flex alignment, so in vertical writing they follow the flex main and cross axes. Centering an axis only shows when that axis has space to give, which is why `both` and `vertical` usually need a `height` — without one the container is only as tall as its content and looks exactly like an uncentered box.

```vue
<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <Center axis="vertical" :height="240">
    <Spinner />
  </Center>
</template>
```

The size of the container comes from `width`, `height`, `maxWidth`, and `minHeight`. Numbers are interpreted as pixels and strings pass through as CSS values, so `width="100%"` and `maxWidth="70rem"` both work. Padding uses the same spacing scale as `Stack`: `padding` sets all four edges, `paddingInline` and `paddingBlock` override their own axis, and `paddingInlineStart`, `paddingInlineEnd`, `paddingBlockStart`, and `paddingBlockEnd` override a single edge. The most specific input wins, and `0` is a real value, so it can clear the inset set by a broader one.

`isInline` renders the container as `inline-flex`. It then takes part in the surrounding line of text instead of breaking the line box, which is what you want for a fixed-size box that centers an icon or a badge.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use a single-axis value only in horizontal writing, or after checking which writing mode is active. Outside horizontal writing, a single-axis value follows the flex main and cross axes rather than the name of the prop. |
| <Badge variant="success">Do</Badge> | Give `height` when you use `axis="vertical"` or the default `both` in horizontal writing. Centering needs space to distribute, and a container that is only as tall as its content shows no change. |
| <Badge variant="success">Do</Badge> | Use `isInline` for small elements such as icons and badges. The box stays inside the current line, so the text around it is not broken. |
| <Badge variant="success">Do</Badge> | Keep the semantic structure and the accessible names on the content. `Center` is a layout-only container: it adds no role and no label, so the content stays responsible for both. |
| <Badge variant="error">Don't</Badge> | Wrap whole page sections in `Center`. Page structure belongs to the surrounding layout; `Center` solves the centering of one block. |
| <Badge variant="error">Don't</Badge> | Use `Center` for horizontal lists of items. Several items in a row are clearer with `Stack` and `hAlign="center"`. |

## Examples

<DemoExample
  :demo="centerBasic"
  description="The default both centers on both axes: the content sits in the middle of a fixed-height box, and the box keeps its own padding."
  locale="en"
  title="Basic usage"
/>

<DemoExample
  :demo="centerAxes"
  description="Three containers using both, horizontal, and vertical. A single-axis value centers only the axis it names and leaves the other axis to the default placement of the content."
  locale="en"
  title="Which axis is centered"
/>

<DemoExample
  :demo="centerPadding"
  description="Padding uses the Stack spacing scale: padding sets all four edges while paddingInline and paddingBlock override their own axis. The gap between the dashed border and the inner block is the inset that is actually applied."
  locale="en"
  title="Padding"
/>

<DemoExample
  :demo="centerInline"
  description="isInline renders inline-flex: the small boxes stay inside the line of text without breaking the line box, and the glyphs inside them are still centered."
  locale="en"
  title="Inline centering"
/>
