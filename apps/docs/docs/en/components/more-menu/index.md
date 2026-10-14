---
layout: component-docs
title: More menu
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { moreMenuBasic, moreMenuBottomSheet, moreMenuDividers, moreMenuSections } from '../../../../components/demos/more-menu'
</script>

## Usage

`MoreMenu` is an overflow menu behind a `⋯` trigger. It holds the actions that do not need to stay visible: secondary actions in a table row, a card header, or a toolbar. The trigger is an icon-only button; everything it offers lives in the menu it opens.

The menu's content is described by an `items` array. A plain entry is one action, `type: 'divider'` is a hairline between groups, and `type: 'section'` is a titled group:

```vue
<script setup lang="ts">
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items = [
  { label: 'Rename', onClick: () => rename() },
  { label: 'Duplicate', onClick: () => duplicate() },
  { type: 'divider' },
  { label: 'Move to trash', variant: 'destructive', onClick: () => remove() },
]
</script>

<template>
  <MoreMenu :items="items" label="File actions" />
</template>
```

The trigger is icon-only, so `label` is its accessible name, the name of the menu itself, and the text of its tooltip. The default, `More options`, fits most interfaces; when the menu holds the actions of one specific thing, a more concrete phrase such as "Project actions" reads better. Use the `icon` slot to replace the three-dot artwork.

Where focus lands when the menu opens depends on how it was opened. A keyboard open (`Enter`, `Space`, `ArrowDown`, or `ArrowUp` on the trigger) lands on the first or the last row; a pointer open puts focus on the menu container and pre-highlights nothing, so no row reads as already selected. Once open, `ArrowDown` and `ArrowUp` move between rows and wrap at both ends, `Home` and `End` jump to the ends, typing a letter jumps to the next row starting with it, `Enter` and `Space` run the focused row, `Escape` closes the menu and returns focus to the trigger, and `Tab` closes the menu and lets the browser move on from the trigger. Disabled rows are skipped and stay out of the keyboard path.

Mouse and touch behave differently on purpose. With a mouse, the highlight follows the pointer while it is held and the release decides which row acts; releasing outside the menu dismisses it. With a finger, a release off the menu leaves it open, because the highlight is following the finger — the gesture ends when a row is picked, the trigger is tapped, or `Escape` is pressed. The `placement` and `alignment` props place the anchored menu beside the trigger and flip it when there is no room; an overflow menu usually wants `alignment="end"`, so the menu lines up with the trigger's trailing edge.

`presentation` decides the shape the actions arrive in. `popover` (the default) is the anchored surface; `bottom-sheet` is a modal panel at the bottom of the screen, sized for a thumb; `adaptive` keeps the anchored menu on pointer-driven layouts and uses the bottom panel at 768px and below when the primary pointer is coarse. Inside the bottom panel a submenu does not open a second panel: the view is replaced, its title becomes the submenu's own label, a back button appears, and `Escape` leaves the submenu before it closes the panel.

The open state can belong to the component or to you. Pass `isMenuOpen` to control it, usually with `v-model:isMenuOpen`; `openChange` fires every time an open or close is requested.

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep it for secondary actions. A primary action belongs in the open, where people can see it; hiding it in a menu makes it hard to find. |
| <Badge variant="success">Do</Badge> | With many entries, group them with dividers or sections — and keep destructive actions last and marked `variant="destructive"`. |
| <Badge variant="success">Do</Badge> | Give similar rows a `description`, so near neighbours such as "Export" and "Publish" can be told apart at a glance. |
| <Badge variant="success">Do</Badge> | Use `alignment="end"` when the trigger sits at the end of a table row or toolbar, so the menu lines up with the trigger instead of covering the content. |
| <Badge variant="success">Do</Badge> | Use `presentation="adaptive"` for interfaces used mostly on phones, where a thumb reaches the actions on a bottom panel. |
| <Badge variant="error">Avoid</Badge> | Vague names, such as a "More" entry inside a "More" menu. The trigger needs a `label` that says what the menu is for. |
| <Badge variant="error">Avoid</Badge> | Piling a dozen actions into one menu. Past a screenful, the reader has to open, scroll, and pick — worse than showing the actions directly. |
| <Badge variant="error">Avoid</Badge> | Keying data or navigation off whether the menu happens to be open. A menu is a temporary surface; its state belongs in your own data. |

## Examples

<DemoExample
  :demo="moreMenuBottomSheet"
  description="A visible overflow trigger that opens actions in a BottomSheet. Use this presentation for short action sets on compact touch surfaces."
  locale="en"
  title="Bottom sheet"
/>

<DemoExample
  :demo="moreMenuBasic"
  description="Basic three-dot overflow menu with simple text-only action items."
  locale="en"
  title="Default"
/>

<DemoExample
  :demo="moreMenuDividers"
  description="A three-dot menu with a divider separating destructive actions from safe ones."
  locale="en"
  title="With dividers"
/>

<DemoExample
  :demo="moreMenuSections"
  description="A three-dot menu with actions organized into labeled groups."
  locale="en"
  title="With sections"
/>
