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


Arrow Down and Arrow Up move one row and wrap, Home and End go to the first and last row, typing a character moves to the matching row, Enter or Space activates the row, and Escape closes the heading menu. Inside a heading's popover the menu takes the heading text as its name; pass `label` to name it differently, and always pass one when the menu is used on its own. Arrow keys move only between `NavHeadingMenuItem` rows, so do not put other controls in the menu.

<ComponentAnatomy />
