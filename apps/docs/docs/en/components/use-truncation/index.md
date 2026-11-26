---
layout: component-docs
title: useTruncation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useTruncationTableCell } from '../../../../components/demos/use-truncation'
</script>

## Usage

Measures whether a piece of text is cut off right now. `Text` and `Heading` build their truncation tooltips on it. Use it directly when your own component should show the full text only when it is actually cut off, such as a table cell: enable the tooltip only while `isTruncated` is true, and put `fullText` in it.

```ts
import { useTruncation } from '@astryx-vue/core/Text'
```

```vue
<script setup lang="ts">
import { useTruncation } from '@astryx-vue/core/Text'
import { Tooltip } from '@astryx-vue/core/Tooltip'

defineProps<{ name: string }>()
const truncation = useTruncation(1)
</script>

<template>
  <Tooltip :content="truncation.fullText.value" :is-enabled="truncation.isTruncated.value">
    <span :ref="truncation.bind" class="cell">{{ name }}</span>
  </Tooltip>
</template>
```

The whole page shares one ResizeObserver and one MutationObserver, so hundreds of cells create one of each, and the first measurement runs after the browser's own layout instead of forcing one during mount.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Apply the clamp yourself and match it to `maxLines`: `white-space: nowrap` with an ellipsis for one line, `-webkit-line-clamp` for more, so what people see and what the hook measures have the same shape. |
| <Badge variant="success">Do</Badge> | Give cut-off text `tabindex="0"` when keyboard users need the full text, so the tooltip can open on focus. |
| <Badge variant="error">Don't</Badge> | Keep the tooltip on when the text fits. It only repeats what is already visible. |

## Examples

<DemoExample
  :demo="useTruncationTableCell"
  description="A narrow table column shows the full path in a Tooltip only where useTruncation reports the text is cut off; the short path shows none. One cell clamped to two lines shows the multi-line case."
  locale="en"
  title="useTruncation — Tooltip on Cut-Off Text"
/>
