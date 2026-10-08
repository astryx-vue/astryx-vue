---
layout: component-docs
title: Dropdown Menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dropdownMenuBasic, dropdownMenuOverview, dropdownMenuSections, dropdownMenuShortcuts } from '../../../../components/demos/dropdown-menu'
</script>

## Usage

`DropdownMenu` turns a button into the entry point for a small set of actions. The button stays quiet; the menu appears next to it when opened, closes as soon as an action is picked, and gives focus back to the button. It is the right shape for "what do I do next" — rename, duplicate, archive, delete — when the actions are one flat level deep.

The shortest form is an `items` array, where each entry is one action:

```vue
<script setup lang="ts">
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu
    :button="{ label: 'Actions' }"
    :items="[
      { label: 'Edit project', icon: 'i-carbon-tools', onClick: () => edit() },
      { label: 'Duplicate project', icon: 'i-carbon-copy', onClick: () => duplicate() },
      { label: 'Delete project', icon: 'i-carbon-trash-can', variant: 'destructive', onClick: () => remove() },
    ]"
  />
</template>
```

Three kinds of entry are allowed: an action (a `label` with an `onClick`, or with an `href` to make the row a link), a divider `{ type: 'divider' }`, and a titled group `{ type: 'section', title, items }`. When the rows depend on state, or you want to write the template yourself, leave `items` out and use the default slot with `DropdownMenuItem`, `DropdownMenuGroup`, and `DropdownMenuDivider`. Both forms render exactly the same DOM, so a menu can move between them without changing how it looks or behaves. A row's `icon` is a CSS icon class — an UnoCSS class such as `i-carbon-copy`, or one of your own — or a component that draws the SVG; astryx-vue ships no icons of its own.

The trigger is the design system's `Button` by default. Pass its props through `button` (`variant`, `size`, `isIconOnly`, …); `size` also sets the height of the menu rows, so a `size="sm"` button goes with a compact menu. When the trigger is not a plain button — an icon button, an avatar, a row in a list — use the `trigger` slot instead and `v-bind` everything the slot hands you onto your own control. The menu then hangs off that control and takes its name from it.

```vue
<template>
  <DropdownMenu>
    <template #trigger="triggerProps">
      <IconButton v-bind="triggerProps" icon="i-carbon-overflow-menu-horizontal" label="More actions" />
    </template>

    <DropdownMenuItem icon="i-carbon-tools" label="Edit project" @click="edit" />
  </DropdownMenu>
</template>
```

Once open, the menu owns the keyboard. The arrow keys move between rows and wrap at both ends, `Home` and `End` jump to the first and last row, `PageUp` and `PageDown` page through a long menu, and typing a letter jumps to the next row that starts with it (pressing the same letter again cycles through the matches). `Enter` and Space run the highlighted row, `Escape` or a press outside closes the menu and returns focus to the trigger, and `Tab` closes the menu as well so the browser keeps its own tab order. Moving the pointer over a row moves focus to it, so keyboard and pointer share one highlight and two rows are never lit at once.

Where the menu opens differs by how it was opened. A keyboard open puts focus on the first row (or the last one for `ArrowUp`); a pointer open only focuses the menu itself, so no row reads as already selected.

The panel places itself: it opens below the trigger, aligned to its start, and flips to the other side when there is no room — `placement` and `alignment` select among above/below/start/end and start/center/end. The width matches the trigger up to a 320px cap, or follows `menuWidth` (a length, or an intrinsic keyword such as `max-content`). The height is capped at 300px and scrolls past that; `menuMaxHeight` raises the cap in pixels for a menu that must fit all of its rows.

Use `v-model:is-menu-open` when something outside the menu drives the open state. A menu that is mounted already open does not move focus — nobody asked for that open, and pulling focus out of the page loses the user's place.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Write row labels as short verb phrases, so one glance tells the user what the row does. |
| <Badge variant="success">Do</Badge> | Use groups and dividers to cluster related actions once a menu grows past five or six rows. |
| <Badge variant="success">Do</Badge> | Mark dangerous rows with `variant="destructive"` and keep them near the bottom of the menu. |
| <Badge variant="success">Do</Badge> | Put a shortcut hint in the `endContent` slot, usually a `Kbd`, instead of spelling the keys into the label. |
| <Badge variant="success">Do</Badge> | Spread the whole `trigger` slot object onto a custom control. Taking only part of it drops `aria-expanded` or `aria-controls`, and a screen reader then cannot tell whether the menu is open. |
| <Badge variant="error">Don't</Badge> | Use a dropdown menu for navigation. A menu performs an action; navigation belongs to a navigation component. |
| <Badge variant="error">Don't</Badge> | Put a dozen rows in one menu without grouping them. Nobody finds anything, and the later options go unread. |
| <Badge variant="error">Don't</Badge> | Use the menu as a form. Anything that needs typing or multiple choices belongs in a dialog or a dedicated control. |

## Examples

<DemoExample
  :demo="dropdownMenuOverview"
  description="An open menu: a group heading, icons, a second line of detail, a shortcut hint, a divider, and a destructive action."
  locale="en"
  title="Menu anatomy"
/>

<DemoExample
  :demo="dropdownMenuBasic"
  description="A row of actions from the items array. Picking one closes the menu and hands focus back to the trigger."
  locale="en"
  title="Basic usage"
/>

<DemoExample
  :demo="dropdownMenuSections"
  description="Sections cluster the actions and a divider separates the clusters. A group's heading is plain text, so the arrow keys never land on it."
  locale="en"
  title="Groups and dividers"
/>

<DemoExample
  :demo="dropdownMenuShortcuts"
  description="An icon-only trigger, with keyboard-shortcut hints placed at the end of each row."
  locale="en"
  title="Custom trigger and shortcuts"
/>
