---
title: Links and routers
---

# Links and routers

A jump in the app is one of two things. A normal `href` lets the browser open the address. A route that should stay inside Vue Router, without a full page load, swaps the root for `RouterLink`.

Components that can swap their root take the same `as` prop. It accepts a component or a tag name. The swap happens only when `href` is set and the item is not disabled. Otherwise the root stays a button and `as` is ignored. On a custom component the same address is passed as both `href` and `to`. `RouterLink` reads `to`.

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
import { RouterLink } from 'vue-router'
</script>

<template>
  <NavItem :as="RouterLink" href="/orders" label="Orders" />
</template>
```

`SideNavItem`, `TopNavItem`, `TopNavHeading`, `NavMenuItem`, and `SideNavHeading` work the same way. Top-nav mega-menu items and featured cards take `as` too. On `OverflowList`, `as` belongs to the list and is applied to visible items that have an `href` and are not disabled.

A button can swap its root when it has an `href` and is not disabled. While it is loading or disabled it goes back to a `<button>`.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Button :as="RouterLink" href="/orders" label="View orders" />
</template>
```

`Link`, `Avatar`, and `BreadcrumbItem` render an `<a>` when they have an address. They do not take `as`. An in-app path in `href` loads as a full page. When that jump has to stay inside the router, use one of the components above, or use the button.

`isExternalLink` on `Link` opens a new tab and adds `noopener noreferrer`. That is an address outside the app, not a route.
