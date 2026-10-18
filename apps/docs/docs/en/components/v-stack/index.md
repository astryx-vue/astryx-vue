---
layout: component-docs
title: V Stack
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { vStackBasic } from '../../../../components/demos/v-stack'
</script>

## Usage

Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.

```ts
import { VStack } from '@astryx-vue/core/Stack'
```

`VStack` is `Stack` with the direction fixed to a column, so the same props work without repeating `direction`. `gap` takes a step from the spacing scale and is the only spacing the column needs: do not add margins to the children.

`vAlign` places the items along the column — `start`, `center`, `end`, `between`, `around`, or `evenly`. `hAlign` sets how the items sit against each other horizontally, and `justify` is a shorter alias for it.

```vue
<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Heading :level="5">
      Weekly Report
    </Heading>
    <Text type="body" color="secondary">
      VStack arranges its children in a vertical column.
    </Text>
  </VStack>
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

<DemoExample :demo="vStackBasic" title="Basic" description="A heading and paragraphs stacked vertically with a consistent gap. Use VStack whenever siblings should flow top to bottom with even spacing." locale="en" />
