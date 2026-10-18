---
layout: component-docs
title: H Stack
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { hStackBasic } from '../../../../components/demos/h-stack'
</script>

## Usage

Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.

```ts
import { HStack } from '@astryx-vue/core/Stack'
```

`HStack` is `Stack` with the direction fixed to a row, so the same props work without repeating `direction`. `gap` takes a step from the spacing scale and is the only spacing the row needs: do not add margins to the children.

`hAlign` places the items along the row — `start`, `center`, `end`, `between`, `around`, or `evenly`. `vAlign` sets how the items sit against each other vertically, and `align` is a shorter alias for it. `wrap` lets a long row continue on the next line instead of overflowing.

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="2">
    <Badge label="React" />
    <Badge label="TypeScript" />
    <Badge label="Node.js" />
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

<DemoExample :demo="hStackBasic" title="Basic" description="Items arranged in a horizontal row with a consistent gap and centered vertical alignment. Use HStack whenever siblings should sit side by side." locale="en" />
