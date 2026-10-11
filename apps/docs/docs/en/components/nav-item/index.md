---
layout: component-docs
title: Nav Item
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navItemBasic } from '../../../../components/demos/nav-item'
</script>

## Usage

`NavItem` is one row in a sidebar, top bar, or menu. It renders a link when `href` is set, and a button when it is disabled or has no address. Pass a CSS icon class through `iconClass`, or use the `icon` slot. `NavIcon`, exported from the same entry, draws the round emphasis badge.

The link root defaults to `a`. Pass `RouterLink` as `as` and the item sets both `href` and `to`.

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <NavItem href="/home" icon-class="i-carbon-home" is-selected label="Home" />
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `isSelected` for the current page. The item writes `aria-current="page"`. |
| <Badge variant="success">Do</Badge> | Turn on `isIconOnly` when the label should stay available to assistive tech only. |
| <Badge variant="error">Avoid</Badge> | Do not ship a built-in icon component. Icons stay as a class or a slot. |

## Examples

<DemoExample :demo="navItemBasic" description="isSelected marks the current page. The icon and label sit on one row." locale="en" title="Basic" />
