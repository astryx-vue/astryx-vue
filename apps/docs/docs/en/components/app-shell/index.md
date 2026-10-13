---
layout: component-docs
title: App Shell
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { appShellBanner, appShellContentOnly, appShellMobileHook, appShellSideNav, appShellTopAndSide, appShellTopNav } from '../../../../components/demos/app-shell'
</script>

## Usage

`AppShell` is the page frame. The default slot is the page content. `topNav`, `sideNav`, `banner`, and `mobileNav` are named slots.

```vue
<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <AppShell :content-padding="6">
    <template #sideNav>
      <SideNav>
        <SideNavItem href="#orders" is-selected label="Orders" />
      </SideNav>
    </template>
    <p>Orders</p>
  </AppShell>
</template>
```

`variant` is `wash`, `surface`, `section`, or `elevated` (the default). `contentPadding` is a spacing step for the content region. `height` is `fill` or `auto`. `fill` uses `100dvh`; an inline `height: 100%` overrides it when the shell sits in a sized preview.

`mobileNav` is `false` or `{ breakpoint, isOpen, hasToggle }`. The default breakpoint is `md` (768px). Below the breakpoint the side nav moves into a drawer. A top nav inside the shell uses that drawer instead of opening one of its own. `v-model:mobile-nav-open` controls the drawer, and the component emits `mobileNavOpenChange`.

A skip link points at `#astryx-app-shell-main`. The main region is a `div` with `role="main"` and `tabindex="-1"`. With `variant="elevated"` and both a top nav and a side nav on a wide viewport, the content sits on a rounded backdrop.

`useAppShellMobile` reads the nearest shell. Outside a shell, or when mobile nav is off, `isMobile` and `isMobileNavEnabled` are false and the open and close methods do nothing.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Put application navigation in the topNav and sideNav slots. Put page regions in Layout. |
| <Badge variant="success">Do</Badge> | Give the side nav a heading so the mobile drawer has a name. |
| <Badge variant="error">Don't</Badge> | Open a second drawer from TopNav while it is inside an AppShell. The shell already owns that drawer. |
| <Badge variant="error">Don't</Badge> | Call useAppShellMobile and assume a shell is present. Check isMobileNavEnabled. |

## Examples

<DemoExample
  :demo="appShellContentOnly"
  description="Content padding without a top nav or a side nav."
  locale="en"
  title="Content only"
/>

<DemoExample
  :demo="appShellMobileHook"
  description="Outside a shell the hook reports that mobile navigation is disabled."
  locale="en"
  title="Mobile hook"
/>

<DemoExample
  :demo="appShellSideNav"
  description="A side nav. Below the md breakpoint it moves into the drawer, and the top bar is the drawer toggle."
  locale="en"
  title="Side navigation"
/>

<DemoExample
  :demo="appShellTopNav"
  description="A top nav and no side nav."
  locale="en"
  title="Top navigation"
/>

<DemoExample
  :demo="appShellTopAndSide"
  description="Top and side navigation. The elevated variant rounds the content corner."
  locale="en"
  title="Top and side navigation"
/>

<DemoExample
  :demo="appShellBanner"
  description="A banner between the navigation and the content."
  locale="en"
  title="Banner"
/>
