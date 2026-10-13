---
layout: component-docs
title: Nav Menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navMenuBasic, navMenuDescriptions, navMenuDisabled, navMenuIcons, navMenuSizes } from '../../../../components/demos/nav-menu'
</script>

## Usage

`NavMenu` is a `role="menu"`. `NavMenuItem` is one entry and becomes a link when `href` is set. `NavDisclosure` owns the trigger, positioning, and dismissal: click, hover, outside press, and Escape all close it. ArrowDown opens on the first item, ArrowUp on the last. Inside the menu, arrows move and a typed character jumps to a matching prefix.

The top nav and overflow list already compose these parts. Use them directly for an account menu.

```vue
<script setup lang="ts">
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <NavDisclosure label="Account">
    <template #trigger="{ isOpen, panelId }">
      <button type="button" :aria-controls="panelId" :aria-expanded="isOpen">
        Account
      </button>
    </template>
    <template #default="{ close, focusRequest }">
      <NavMenu label="Account" :focus-request="focusRequest" @close="close">
        <NavMenuItem href="/profile" label="Profile" />
      </NavMenu>
    </template>
  </NavDisclosure>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Write `aria-expanded` and `aria-controls` on the trigger. The slot already passes that state. |
| <Badge variant="success">Do</Badge> | Items close the menu by default. Set `keepOpen` when the menu should stay. |
| <Badge variant="error">Avoid</Badge> | Do not leave `menuitem` elements in a drawer. Set `isMenuItem` to false there. |

## Examples

<DemoExample
  :demo="navMenuBasic"
  description="Open Account to see Profile, Notifications, and Settings. Choosing an item closes the menu and returns focus to the button."
  locale="en"
  title="Basic usage"
/>

<DemoExample
  :demo="navMenuIcons"
  description="Each item leads with an icon, so Profile, Notifications, and Settings are easy to tell apart."
  locale="en"
  title="Icons"
/>

<DemoExample
  :demo="navMenuDescriptions"
  description="A second line under the label says what that item covers."
  locale="en"
  title="Descriptions"
/>

<DemoExample
  :demo="navMenuSizes"
  description="The same items at sm and lg. Open Small or Large: the narrow menu stays compact, and the wide one leaves room for longer labels."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="navMenuDisabled"
  description="Billing stays in the menu but cannot be chosen, and the arrow keys skip it."
  locale="en"
  title="Disabled items"
/>
