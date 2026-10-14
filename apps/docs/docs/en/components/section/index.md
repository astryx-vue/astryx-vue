---
layout: component-docs
title: Section
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sectionDividers, sectionWash } from '../../../../components/demos/section'
</script>

## Usage

`Section` groups a region of a page: a settings group, a form section, or a highlighted block. It paints a background, applies padding from the spacing scale, and can draw a divider on any side.

```vue
<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
</script>

<template>
  <Section :padding="4">
    <p>Account</p>
  </Section>
</template>
```

`variant` is `section` (surface), `muted`, or `transparent`. `padding` defaults to step 4. A single edge overrides the axis, and an axis overrides `padding`. `dividers` accepts `top`, `bottom`, `start`, and `end`; `start` and `end` follow writing direction.

The outer box uses a negative margin so a section can escape the padding of a parent container such as `Card` or `LayoutContent`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use Section for a region of a page. Use Card for one discrete item, such as a profile or a notification. |
| <Badge variant="success">Do</Badge> | Start with the default variant. Use muted when one region should stand out. |
| <Badge variant="success">Do</Badge> | Add a divider between adjacent sections that share a background. |
| <Badge variant="error">Don't</Badge> | Restate the theme padding with an extra margin on the children. Set `padding` on the section. |

## Examples

<DemoExample :demo="sectionWash" description="A default section stacked with a full-width muted section, so one region such as an upgrade prompt stands out." locale="en" title="Default with wash" />

<DemoExample :demo="sectionDividers" description="Adjacent sections of the same variant, separated by a bottom divider, as on a settings page." locale="en" title="With dividers" />
