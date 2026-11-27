---
layout: component-docs
title: Nav Heading Menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navHeadingMenuSideNav, navHeadingMenuTopNav } from '../../../../components/demos/nav-heading-menu'
</script>

## Usage

Accessible menu container and items for nav heading popovers. `NavHeadingMenu` provides `role="menu"` with keyboard navigation; `NavHeadingMenuItem` renders individual selectable items. Pass it to the `menu` slot of `SideNavHeading` or `TopNavHeading`.

The menu opens in place: the popover covers the heading, its first row is the heading itself (chevron pointing up, press it to close), and the items follow below, all on one rounded card. Choosing an enabled item runs its link or `click` and closes the menu.

```ts
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
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
          <NavHeadingMenu size="lg">
            <NavHeadingMenuItem href="/dashboard" label="Dashboard" />
            <NavHeadingMenuItem href="/analytics" label="Analytics" />
          </NavHeadingMenu>
        </template>
      </SideNavHeading>
    </template>
  </SideNav>
</template>
```

## Keyboard

The keyboard follows the [WAI-ARIA APG Menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/):

| Key | Action |
| --- | --- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | On the heading's chevron button, opens the menu on the first or last row. In the menu, moves one row and wraps. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Moves to the first or last row. |
| Character keys | Moves to the next item starting with that character. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the current item. |
| <kbd>Esc</kbd> | Closes the menu and returns focus to the heading's chevron button. |

## Accessibility

- The heading's chevron button carries `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`, and its name includes the heading text, so a screen reader says which product or space the menu belongs to.
- Inside the popover, `role="menu"` wraps only the items. The repeated heading row above them is a plain button, not part of the menu.
- Inside a heading's popover the menu takes the heading text as its name; pass `label` to name it differently. Always pass `label` when `NavHeadingMenu` is used on its own, or the menu has no name.
- An item with `href` renders as a link and one without renders as a `div` with `role="menuitem"`. A disabled item carries `aria-disabled`.

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Put <code>NavHeadingMenu</code> in the <code>menu</code> slot of <code>SideNavHeading</code> or <code>TopNavHeading</code>, and let the heading handle closing and focus. |
| <Badge variant="success">Do</Badge> | Give a menu used on its own a <code>label</code>. |
| <Badge variant="error">Avoid</Badge> | Do not put other interactive controls in the menu. The arrow keys move only between <code>NavHeadingMenuItem</code> rows, so another control is skipped. |
| <Badge variant="error">Avoid</Badge> | Do not remove a destination the user cannot use right now when knowing it exists helps them. Set <code>isDisabled</code> instead. |

## Examples

<DemoExample :demo="navHeadingMenuSideNav" description="The side nav heading opens a product switcher over the heading. Dashboard, Analytics, and Settings are the destinations." locale="en" title="Product switcher" />

<DemoExample :demo="navHeadingMenuTopNav" description="The top nav heading switches environments. Items carry an icon and a description, and an environment that is not available yet is disabled." locale="en" title="Environment switcher in a top nav" />

<ComponentAnatomy />
