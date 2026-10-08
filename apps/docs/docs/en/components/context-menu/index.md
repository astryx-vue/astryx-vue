---
layout: component-docs
title: Context Menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { contextMenuBasic, contextMenuCompound, contextMenuOverview, contextMenuSubmenu } from '../../../../components/demos/context-menu'
</script>

## Usage

`ContextMenu` gives one region of the interface its own actions: a right-click inside the trigger area — or the keyboard's context-menu key, or a long press on touch — opens a menu at the pointer. It fits list rows, canvases, file nodes, and table cells: places where the actions belong to a specific object and a permanent row of buttons would only add clutter. Each row behaves like a menu row, with an icon, a description, a shortcut hint, or a disabled state.

The pointer position is converted into the trigger's own coordinates and materialized as a zero-size anchor, so the panel is positioned relative to the trigger rather than the viewport. It follows the content when the page scrolls, flips above the pointer near the bottom edge, and never leaves the screen.

There are two ways to describe the content. The data-driven one hands the rows to `items`:

```vue
<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'

const items: ContextMenuOption[] = [
  { label: 'Rename', icon: 'i-carbon-tools' },
  { label: 'Copy link', icon: 'i-carbon-copy' },
  { type: 'divider' },
  { label: 'Delete', variant: 'destructive' },
]
</script>

<template>
  <ContextMenu :items="items" label="File actions">
    <div>Right-click here</div>
  </ContextMenu>
</template>
```

An entry of `items` is one of three shapes: an action row (`label` is required; `icon`, `description`, `endContent`, `onClick`, `isDisabled`, `variant`, `hasCloseOnSelect`, and `href`/`target`/`rel` are optional), a divider `{ type: 'divider' }`, or a section `{ type: 'section', title, items }`. A row that also carries `items` becomes a submenu, revealed beside it on hover or with the right arrow key. The `icon` is a CSS icon class — an UnoCSS class such as `i-carbon-copy`, or one of your own — or a component that draws the SVG; astryx-vue ships no icons of its own.

When the menu needs to be composed by hand, use the `content` slot with the exported menu components instead. Both styles share one keyboard model:

```vue
<template>
  <ContextMenu label="File actions">
    <div>Right-click here</div>
    <template #content>
      <ContextMenuItem icon="i-carbon-tools" label="Rename" />
      <ContextMenuDivider />
      <ContextMenuGroup title="Danger zone">
        <ContextMenuItem label="Delete" variant="destructive" />
      </ContextMenuGroup>
    </template>
  </ContextMenu>
</template>
```

Open state is managed for you: a right-click opens the menu, and a click outside, Escape, or Tab closes it. Every change is reported through the `openChange` event. Bind `v-model:is-open` when something outside the component should decide, and the menu renders exactly the bound value.

Focus lands on the first available row when the menu opens. The arrow keys move between rows and wrap at both ends, Home and End jump to the first and last row, PageDown and PageUp move by a screenful, and typing letters jumps to the next row whose label starts with them — pressing the same letter again cycles through the matches. Enter and Space activate the focused row, Escape closes the menu and returns focus to whatever was focused before it opened, and Tab closes the menu while letting the browser move focus on from there. A disabled row is marked `aria-disabled`, leaves the tab order, and is skipped by both the arrow keys and typeahead. The surface is `role="menu"`, rows are `role="menuitem"`, sections are `role="group"`, and dividers are `role="separator"`.

`isDisabled` stops the component intercepting the right-click, so the browser's own menu still appears and people keep their spell-check, copy, and inspect tools. `triggerAs` decides whether the trigger renders as a block `div` or an inline `span`; the inline form lets a word inside running prose own a context menu without breaking the layout.

The panel is at least 160px wide and grows with its rows unless `menuWidth` pins a width; either way it is capped to the viewport, and content taller than 300px scrolls inside it. `size` changes only the rows' block padding, from `sm` to `lg`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Name what happens in each row. "Rename" and "Copy link" are understood; "Action" and "More" are not. |
| <Badge variant="success">Do</Badge> | Group related actions with sections and dividers once a menu holds more than a handful of rows. |
| <Badge variant="success">Do</Badge> | Offer a visible route to the same actions. Not everyone knows to right-click, and screen reader users need to be told the menu exists. |
| <Badge variant="success">Do</Badge> | Keep destructive actions at the bottom of the menu and mark them `variant="destructive"`. |
| <Badge variant="success">Do</Badge> | Use `triggerAs="span"` when a word inside running prose needs the menu, so no block element lands inside a paragraph. |
| <Badge variant="error">Don't</Badge> | Make the context menu the only way to reach important actions. Both the right-click and the long press are hidden gestures. |
| <Badge variant="error">Don't</Badge> | Stack more than ten or so rows without grouping them. Long menus are slow to scan and hard to reach the end of. |
| <Badge variant="error">Don't</Badge> | Put a multi-step form inside a menu. A dialog or its own page is the right home for that. |

## Examples

<DemoExample
  :demo="contextMenuOverview"
  description="The painted menu surface: rows with icons and a secondary description, a divider, and a destructive action."
  locale="en"
  title="Menu surface"
/>

<DemoExample
  :demo="contextMenuBasic"
  description="A data-driven menu with action rows, a disabled row, a section, a divider, and a destructive action. The chosen row is reported back on the page."
  locale="en"
  title="Basic usage"
/>

<DemoExample
  :demo="contextMenuCompound"
  description="Compound mode: the content slot composes the menu from menu components, and one row reports its result in place instead of closing the menu."
  locale="en"
  title="Custom content"
/>

<DemoExample
  :demo="contextMenuSubmenu"
  description="Nested items turn a row into a submenu, revealed on hover or with the right arrow key, at any depth."
  locale="en"
  title="Submenus"
/>
