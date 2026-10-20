---
layout: component-docs
title: Nav Icon
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navIconBasic } from '../../../../components/demos/nav-icon'
</script>

## Usage

`NavIcon` is a circular icon container with an accent-colored background. Use it in navigation headers such as `TopNavHeading` and `PageNavHeader` to visually identify a section or application.

```ts
import { NavIcon } from '@astryx-vue/core/NavItem'
```

Pass a CSS icon class through `iconClass`, or put the icon element itself in the default slot.


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use in navigation headers to provide a recognizable visual anchor for the section. |
| <Badge variant="success">Do</Badge> | Pass an `Icon` or similarly sized icon component to ensure proper proportions. |
| <Badge variant="error">Don't</Badge> | Use `NavIcon` for interactive purposes; it is a display-only container, not a button. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="navIconBasic" title="Basic" description="Circular icon containers wrapping semantic icons. Use as logos or accent icons in navigation headers such as TopNavHeading." locale="en" />
