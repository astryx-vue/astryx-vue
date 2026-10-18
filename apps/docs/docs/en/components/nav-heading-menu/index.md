---
layout: component-docs
title: Nav Heading Menu
outline: false
footer: false
---

## Usage

Accessible menu container and items for nav heading popovers. `NavHeadingMenu` provides `role="menu"` with keyboard navigation; `NavHeadingMenuItem` renders individual selectable items. Pass it to the `menu` slot of `SideNavHeading` or `TopNavHeading`.

```ts
import { NavHeadingMenu } from '@astryx-vue/core/NavMenu'
```

```vue
<script setup lang="ts">
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <template #header>
      <SideNavHeading heading="Acme Platform">
        <template #menu>
          <NavHeadingMenu label="Acme Platform" size="lg">
            <NavHeadingMenuItem href="/dashboard" label="Dashboard" />
            <NavHeadingMenuItem href="/analytics" label="Analytics" />
          </NavHeadingMenu>
        </template>
      </SideNavHeading>
    </template>
  </SideNav>
</template>
```


<ComponentAnatomy />
