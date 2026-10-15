---
layout: component-docs
title: Dropdown Menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dropdownMenuActions, dropdownMenuAdaptive, dropdownMenuDisabled, dropdownMenuDrill, dropdownMenuIconTrigger, dropdownMenuRegions, dropdownMenuSections, dropdownMenuSelection, dropdownMenuSubmenu } from '../../../../components/demos/dropdown-menu'
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

An entry can be an action, a divider, a titled group, a checkbox row, or a radio group. An action says what happens next. A checkbox row carries whether it is on. A radio group carries the selected value and lists its options. Those rows are also documented on their own pages: [Dropdown Menu Checkbox Item](/en/components/dropdown-menu-checkbox-item), [Dropdown Menu Radio Group](/en/components/dropdown-menu-radio-group), and [Dropdown Menu Radio Item](/en/components/dropdown-menu-radio-item). When the rows follow page state, or you want to lay them out yourself, use the default slot and the matching row components. Both forms draw the same structure. In a template, put the built-in icon in the icon slot and pass its name. In the data array, pass an icon component or a CSS icon class.

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

Use a two-way binding on the open state when something outside the menu drives it. A menu that is mounted already open does not move focus — nobody asked for that open, and pulling focus out of the page loses the user's place.

A checkbox row toggles one view setting. Activating it flips the state and leaves the menu open, so several settings can change in one visit. Radio rows belong in a radio group, and only one of them can be selected. Choosing one closes the menu, because the choice is made. Arrow keys still move across these rows, and Space or Enter toggles the highlighted one. A disabled row stays in the menu, but the arrows skip it and a click does not change it. The check mark and the radio dot are decorative; the whole row is the control. On a coarse pointer the mark moves to the end of the row.

Content that is not an option can sit above or below the rows: a filter field, or a button that creates something. It is drawn in the same frame and is not part of the menu. Typing there does not jump to a row by its first letter. The menu itself is one tab stop in that frame. Shift+Tab from a row skips the menu element and lands on the last focusable control above it. Tab onward from the last control below, or Shift+Tab from the first control above, closes the menu. A pointer open does not paint a focus ring on the menu; the ring appears once keyboard focus later tabs onto it.

A submenu flies out beside its row on a wide screen. On a compact touch surface the next level replaces the current rows and adds a Back row at the top, named after the parent. That choice is made when the menu opens and does not change while it stays open. A submenu can also be forced to always fly out, or always replace the rows. While its children are still loading, the caret can become a spinner, and the submenu can still be opened. A flyout is at least about 160 pixels wide unless a width is set, and it never grows past the viewport.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Write row labels as short verb phrases, so one glance tells the user what the row does. |
| <Badge variant="success">Do</Badge> | Use groups and dividers to cluster related actions once a menu grows past five or six rows. |
| <Badge variant="success">Do</Badge> | Mark dangerous rows with `variant="destructive"` and keep them near the bottom of the menu. |
| <Badge variant="success">Do</Badge> | Put a shortcut hint in the `endContent` slot, usually a `Kbd`, instead of spelling the keys into the label. |
| <Badge variant="success">Do</Badge> | Use checkbox rows for view toggles and leave the menu open. Use a radio group for one choice among several, and let it close. |
| <Badge variant="success">Do</Badge> | Put a filter or a create action above or below the rows, not inside the list of options. |
| <Badge variant="success">Do</Badge> | Spread the whole trigger-slot object onto a custom control. Taking only part of it drops the expanded state or the control relationship, and a screen reader then cannot tell whether the menu is open. |
| <Badge variant="error">Don't</Badge> | Use a dropdown menu for navigation. A menu performs an action; navigation belongs to a navigation component. |
| <Badge variant="error">Don't</Badge> | Put a dozen rows in one menu without grouping them. Nobody finds anything, and the later options go unread. |
| <Badge variant="error">Don't</Badge> | Use the menu as a form. Anything that needs typing or multiple choices belongs in a dialog or a dedicated control. |

## Examples

<DemoExample
  :demo="dropdownMenuActions"
  description="An action menu with a divider between everyday actions and destructive ones. Picking a row reports the last action."
  locale="en"
  title="Actions"
/>

<DemoExample
  :demo="dropdownMenuAdaptive"
  description="A compact touch surface opens a bottom sheet. Everywhere else the menu stays anchored to the button."
  locale="en"
  title="Adaptive presentation"
/>

<DemoExample
  :demo="dropdownMenuDisabled"
  description="Some rows stay disabled when the current user cannot run them."
  locale="en"
  title="Disabled"
/>

<DemoExample
  :demo="dropdownMenuIconTrigger"
  description="An icon-only button opens the menu, with no chevron and no label on the trigger."
  locale="en"
  title="Icon trigger"
/>

<DemoExample
  :demo="dropdownMenuSections"
  description="Titled sections group the rows, so a longer menu stays easy to scan."
  locale="en"
  title="Sections"
/>

<DemoExample
  :demo="dropdownMenuSubmenu"
  description="Hover or the Right arrow opens the flyout. Left arrow or Escape closes it and returns to the parent row."
  locale="en"
  title="Submenu"
/>

<DemoExample
  :demo="dropdownMenuSelection"
  description="Checkbox rows leave the menu open so several settings can change together. Choosing a sort order closes the menu and updates the summary."
  locale="en"
  title="Checkbox and radio"
/>

<DemoExample
  :demo="dropdownMenuRegions"
  description="The filter sits above the rows and the create button sits below. Typing in the filter narrows the labels and does not jump to a row."
  locale="en"
  title="Header and footer"
/>

<DemoExample
  :demo="dropdownMenuDrill"
  description="Move to replaces the current rows and adds a Back row. Share is still loading, so its caret is a spinner."
  locale="en"
  title="Drill-in and loading"
/>
