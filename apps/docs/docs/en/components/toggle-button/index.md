---
layout: component-docs
title: Toggle Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toggleButtonBasic, toggleButtonGroup, toggleButtonIconOnly, toggleButtonStates } from '../../../../components/demos/toggle-button'
</script>

## Usage

`ToggleButton` is a button with a pressed and an unpressed state. It stands for a lasting choice — bold text, a view mode, a favorite, a running recording — rather than a one-off action. It reuses the look, the sizes, and the async action machinery of `Button`, and adds the pressed state, the `aria-pressed` semantics, and the icon and weight shift that come with it.

On its own, the pressed state is bound to the component:

```vue
<script setup lang="ts">
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isPinned = shallowRef(false)
</script>

<template>
  <ToggleButton v-model:is-pressed="isPinned" label="Pin to top" />
</template>
```

A click emits `pressedChange` first, carrying the next state and the originating click event, and then writes `v-model:is-pressed`. Calling `event.preventDefault()` in that handler means you own the toggle: the component neither changes the state nor runs `pressedChangeAction`. With nothing bound at all, the button keeps the pressed state itself.

When the toggle has to wait for a request or a route, use `pressedChangeAction` instead of hand-written loading state. While the action is pending the button shows the next state and a spinner, and it stays clickable: a second click reverses the toggle that has not settled yet instead of being dropped.

```vue
<script setup lang="ts">
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isShared = shallowRef(false)

async function shareWithTeam(next: boolean) {
  await api.setShared(boardId, next)
}
</script>

<template>
  <ToggleButton
    v-model:is-pressed="isShared"
    label="Share with team"
    :pressed-change-action="shareWithTeam"
  />
</template>
```

Related toggles belong in a `ToggleButtonGroup`, so a screen reader announces them as one set:

```vue
<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null | string[]>('board')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton value="list" label="List" />
    <ToggleButton value="board" label="Board" />
  </ToggleButtonGroup>
</template>
```

A group is single-select by default: one member is pressed, and clicking it again clears the selection (the value becomes `null`). With `type="multiple"` each member switches on its own, which suits filters and column pickers. The group size reaches every member unless the member sets its own; a disabled group disables all of them, while a member that disables itself stays disabled even in an enabled group. The group owns the pressed state of its members, so a member's own `isPressed`, `pressedChange` and `pressedChangeAction` are ignored.

For an icon-only toggle set `isIconOnly`: the button becomes square, `label` becomes the accessible name, and `tooltip` supplies the hover hint. To swap in a filled glyph while pressed, put it in the `pressedIcon` slot; the slot falls back to `icon` when it is empty.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Show the pressed state with a filled or colored icon, such as a microphone that becomes a solid square, so the current state is obvious at a glance. |
| <Badge variant="success">Do</Badge> | Keep the label text identical in both states and let the background, the weight, and the icon carry the difference. |
| <Badge variant="success">Do</Badge> | Wrap related toggles in a `ToggleButtonGroup` with a `label`, so a screen reader announces them as one set. |
| <Badge variant="success">Do</Badge> | Reach for `pressedChangeAction` when a request backs the toggle; the button then previews the next state and shows the spinner for you. |
| <Badge variant="error">Don't</Badge> | Use it for one-time actions such as "Submit" or "Delete"; those are plain `Button`s. |
| <Badge variant="error">Don't</Badge> | Mix regular `Button`s into a `ToggleButtonGroup`; a group holds `ToggleButton`s only. |
| <Badge variant="error">Don't</Badge> | Use it for a setting that persists across sessions; `Switch` reads as a setting, a toggle reads as an action on the current content. |

## Examples

<DemoExample
  :demo="toggleButtonBasic"
  description="A view switcher with one pressed member, next to a standalone filter toggle that shows the pressed background and the colored pressed icon."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="toggleButtonGroup"
  description="A single-select alignment group that keeps one member pressed and clears on a second click, above a multi-select group where every column switches on its own."
  locale="en"
  title="Single and multiple"
/>

<DemoExample
  :demo="toggleButtonIconOnly"
  description="An icon-only toolbar that leans on label for its accessible name and tooltip for the hover hint, plus a record toggle that swaps to a solid glyph while pressed."
  locale="en"
  title="Icon only and pressed icon"
/>

<DemoExample
  :demo="toggleButtonStates"
  description="Three sizes, a disabled and a loading toggle, and an async toggle driven by pressedChangeAction that keeps previewing the next state until the action settles."
  locale="en"
  title="Sizes and states"
/>
