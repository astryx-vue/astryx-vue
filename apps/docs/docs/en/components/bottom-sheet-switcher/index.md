---
layout: component-docs
title: Bottom Sheet Switcher
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bottomSheetSwitcherReviewFlow } from '../../../../components/demos/bottom-sheet-switcher'
</script>

## Usage

`BottomSheetSwitcher` is deprecated. Write each step as its own `BottomSheet` with `isOpen`, driven by one state value that names the open step; moving on from inside the open step replaces it in place with the same handoff (see [Bottom Sheet](/en/components/bottom-sheet), Replacing a sheet). The switcher keeps working until a future minor release removes it.

It coordinates a multi-step bottom-sheet flow in which each step presents its own native dialog; bind `v-model:active-sheet` to a nested `BottomSheet`'s `sheet-id` to open or switch steps, and to `null` to close.

```vue
<script setup lang="ts">
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
import { ref } from 'vue'

const activeSheet = ref<string | null>(null)
</script>

<template>
  <button type="button" @click="activeSheet = 'details'">
    Start checkout
  </button>
  <BottomSheetSwitcher v-model:active-sheet="activeSheet">
    <BottomSheet sheet-id="details" label="Details">
      <p>Confirm the order.</p>
    </BottomSheet>
    <BottomSheet sheet-id="review" label="Review">
      <p>Check everything before you pay.</p>
    </BottomSheet>
  </BottomSheetSwitcher>
</template>
```

Every child needs its own `sheet-id` and a non-empty `label`. The switcher names every step's dialog from its own `label`, falling back to that step's label. Only the sheet whose `sheet-id` matches `active-sheet` is interactive. When the step changes, the new step rises in its own dialog above the previous one; if the previous step is taller, it moves down to meet the new step's top edge at the same time, and it fades and closes only after both motions finish. The previous step is inert from the start, and its scrim holds the dim during the handoff, so changing steps does not flash the scrim. `id` and `data-testid` land on the dialog of the step that is showing. A scrim flow is one level of the bottom-sheet stack: a standalone sheet opened over it stacks on top, and switching steps keeps the flow's place.

`purpose` sets how the whole flow can be dismissed, matching `Dialog`. Leave it out and the step that is showing decides: `info` allows Escape, a scrim click, and a swipe, `form` allows Escape only so typed input is not thrown away, and `required` blocks every implicit path. `hasScrim` defaults to `true` and draws one scrim for the entire flow; it stays up while steps change and only goes away when the flow closes, which is what makes a multi-step flow feel like one surface instead of several dialogs.

Escape asks the switcher to close. `cancel` fires first with the native cancel event, so calling `event.preventDefault()` on it keeps the flow open.

When the flow closes, or the switcher is removed while a step is open, focus that was inside it returns to the element that was focused when the flow opened, with or without a scrim. Each step opens on its first eligible `data-autofocus` field, else on the step's panel. A flow already open in the server markup appears settled after hydration, with no entrance motion.

```ts
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use when each step depends on the previous one and only one step needs attention at a time. |
| <Badge variant="success">Do</Badge> | Give every child a unique `sheet-id` and non-empty `label`, choose its `purpose` to match dismissal requirements, and follow the [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for scrim-backed flows. |
| <Badge variant="error">Don't</Badge> | Don't split information across sheets when people need to compare it; use a full-page layout that keeps the relevant content visible together instead. |
| <Badge variant="error">Don't</Badge> | Don't use the switcher when multiple panels must stay interactive or visible together; `active-sheet` intentionally selects one interactive step. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="bottomSheetSwitcherReviewFlow" title="Review flow" description="A two-step form flow that lets a person review settings, confirm them, or move back without replacing the shared dialog." locale="en" />
