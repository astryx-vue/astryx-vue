---
title: Icons
---

# Icons

astryx-vue does not ship an icon component, and there is no icon subpath. The caller draws the icon with CSS and passes the class to the component. That is Anthony Fu's CSS icon approach: the class is the artwork, and the component owns the slot, the size, and the accessible name.

The docs site uses UnoCSS `presetIcons` with the Carbon and Heroicons collections. That is why `i-carbon-home` shows up in examples. An app can use any class that draws a glyph, as long as the build actually generates it. Components do not look up icon names.

`iconClass` is accepted by `NavItem`, `NavIcon`, `SideNavItem`, `TopNav` items, and menu items. `selectedIconClass` swaps the glyph when the item is selected. The `icon` slot is the alternative to a class.

`IconButton` has no `iconClass`. Put the glyph in the default slot. `label` is the accessible name. A button that shows only an icon still needs `label`.

```vue
<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <NavItem href="/home" icon-class="i-carbon-home" label="Home" />
  <IconButton label="Search">
    <span class="i-carbon-search" />
  </IconButton>
</template>
```

An `Icon` component exists inside the library and is not exported. The built-in glyphs are `chevronDown`, `chevronLeft`, `chevronRight`, `check`, `moreHorizontal`, and `copy`. They belong to component chrome, such as a menu chevron or a copy button. They are not a general icon set.
