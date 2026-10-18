---
layout: component-docs
title: Mobile Nav Toggle
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mobileNavToggleBasic } from '../../../../components/demos/mobile-nav-toggle'
</script>

## Usage

The button that opens [Mobile Nav](/en/components/mobile-nav) on a narrow viewport. It draws the two-line menu glyph, turns it into a close mark while the drawer is open, and keeps `aria-expanded` in step.

```ts
import { MobileNavToggle } from '@astryx-vue/core/MobileNav'
```

Bind the toggle and the drawer to the same `v-model:is-open`, and point `controls` at the drawer's id so the button and the dialog are related:

```vue
<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MobileNavToggle v-model:is-open="open" controls="app-nav" label="Open navigation" />
  <MobileNav id="app-nav" v-model:is-open="open" header="Navigation" side="start">
    <!-- items -->
  </MobileNav>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Bind the toggle and the drawer to the same `v-model:is-open`, so the glyph never disagrees with the drawer. |
| <Badge variant="success">Do</Badge> | Share the same nav items between Mobile Nav and Side Nav by extracting them into a variable. |
| <Badge variant="success">Do</Badge> | Give it a `label` when the page has more than one navigation region, so the button says which one it opens. |
| <Badge variant="error">Don't</Badge> | Use Mobile Nav on desktop: use a persistent Side Nav instead. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="mobileNavToggleBasic" title="Basic" description="A nav toggle with an accessible label next to a page title. It opens a Mobile Nav drawer bound to the same state." locale="en" />
