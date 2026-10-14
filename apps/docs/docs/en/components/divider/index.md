---
layout: component-docs
title: Divider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dividerFullBleed, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
</script>

## Usage

`Divider` separates groups of content with a thin rule. It can carry a centered label.

```vue
<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
</script>

<template>
  <Divider label="or" />
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use subtle dividers between related content sections and strong dividers for high-contrast boundaries. |
| <Badge variant="success">Do</Badge> | Add a label to the divider when sections need a visible category heading. |
| <Badge variant="error">Don't</Badge> | Overuse dividers; rely on spacing and layout to separate content when possible. |

## Examples

<DemoExample :demo="dividerFullBleed" description="The rule runs past the card padding, from edge to edge, between the line items and the total." locale="en" title="Full bleed" />

<DemoExample :demo="dividerVariants" description="A labeled rule for an alternative such as “or”, then a strong rule before the fine print." locale="en" title="Variants" />

<DemoExample :demo="dividerVertical" description="Vertical rules between side-by-side metrics." locale="en" title="Vertical" />
