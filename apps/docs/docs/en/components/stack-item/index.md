---
layout: component-docs
title: Stack Item
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackItemFill } from '../../../../components/demos/stack-item'
</script>

## Usage

Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.

```ts
import { StackItem } from '@astryx-vue/core/Stack'
```

`StackItem` wraps one child of a `Stack` when that child needs its own sizing rule. `size` is `static` by default, which keeps the intrinsic size; `fill` lets the item take the space the other items leave over. `crossAlignSelf` overrides the stack's cross-axis alignment for this one item, and `isScrollable` turns the item into a scroll region of its own.

The wrapper also applies the flex reset — `min-width` and `min-height` of zero — so a long value inside cannot widen the row it sits in.

```vue
<script setup lang="ts">
import { HStack, StackItem } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="3">
    <StackItem size="static">
      Static
    </StackItem>
    <StackItem size="fill">
      Fills remaining space
    </StackItem>
  </HStack>
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the gap prop for spacing between items; don't add margins manually. |
| <Badge variant="success">Do</Badge> | Use StackItem with `size="fill"` to make one item stretch and fill the leftover space. |
| <Badge variant="error">Don't</Badge> | Nest stacks inside stacks; try `wrap="wrap"` first to let items flow to the next line. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="stackItemFill" title="Fill" description="A static-width item next to one that fills the remaining space. Wrap stack children in StackItem when an item needs explicit sizing control." locale="en" />
