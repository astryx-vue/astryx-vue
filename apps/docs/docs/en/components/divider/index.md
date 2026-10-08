---
layout: component-docs
title: Divider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dividerBasic, dividerLabel, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
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

<DemoExample :demo="dividerBasic" title="Basic" description="A horizontal rule spans the available width." locale="en" />

<DemoExample :demo="dividerLabel" title="Label" description="A label sits in the middle of the rule. The label uses supporting text styling." locale="en" />

<DemoExample :demo="dividerVariants" title="Variants" description="subtle is the default weight. strong uses the emphasized border color." locale="en" />

<DemoExample :demo="dividerVertical" title="Vertical" description="Set orientation to vertical inside a row with a fixed height." locale="en" />

## Accessibility

A divider is not interactive, but assistive technology still has to know that it is a separator and which orientation it uses before it can describe the element correctly. The component supplies that semantics on the root element:

- The root element has `role="separator"`, and `aria-orientation` reports the current `orientation`.
- When you provide a `label`, the label text becomes the accessible name through `aria-labelledby`.

If you want to name the separator with different text, set `aria-label`. Once `aria-label` is set, the component uses it as the accessible name and no longer links the `label` automatically.
