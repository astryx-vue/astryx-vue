---
layout: component-docs
title: useAppShellMobile
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAppShellMobileCustomTrigger } from '../../../../components/demos/use-app-shell-mobile'
</script>

## Usage

Hook for reading and controlling AppShell mobile navigation state from descendants of AppShell. Use it for custom mobile nav triggers, closing the drawer after route changes, or coordinating AppShell-adjacent mobile experiences with the same breakpoint used by mobile nav.

```ts
import { useAppShellMobile } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAppShellMobile } from '@astryx-vue/core'

const { isMobile, isMobileNavEnabled, mobileNavId, openMobileNav } = useAppShellMobile()
</script>

<template>
  <button
    v-if="isMobile && isMobileNavEnabled"
    type="button"
    :aria-controls="mobileNavId"
    @click="openMobileNav"
  >
    Open navigation
  </button>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use inside the AppShell tree when building custom mobile navigation controls, route-aware nav items, or UI that should update at the same breakpoint as AppShell mobile nav. |
| <Badge variant="success">Do</Badge> | Prefer `MobileNavToggle` for the standard hamburger trigger: use this hook when you need custom placement, styling, or extra behavior. |
| <Badge variant="success">Do</Badge> | Call `closeMobileNav` after a custom mobile nav item changes route so the drawer dismisses cleanly. |
| <Badge variant="error">Don't</Badge> | Use as a general responsive primitive when the UI is not inside AppShell or does not need to align with AppShell mobile nav: use `useMediaQuery` instead. |
| <Badge variant="error">Don't</Badge> | Assume it throws outside AppShell. The hook returns safe defaults and no-op callbacks when no provider is present. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useAppShellMobileCustomTrigger"
  description="Custom mobile navigation trigger built with useAppShellMobile. The trigger consumes the surrounding AppShell context instead of rendering its own shell."
  locale="en"
  title="useAppShellMobile — Custom Mobile Trigger"
/>
