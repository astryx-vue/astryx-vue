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

Coordinates a multi-step bottom-sheet flow in one shared dialog; bind `v-model:active-sheet` to a nested `BottomSheet`'s `sheet-id` to open or switch steps, and to `null` to close.

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

Every child needs its own `sheet-id` and a non-empty `label`. The switcher names the dialog from its own `label`, falling back to the active sheet's label, so the flow keeps one accessible name the whole way through. Only the sheet whose `sheet-id` matches `active-sheet` is interactive; during a handoff the previous panel stays painted underneath, inert, until the new step has settled, so changing steps does not flash the scrim.

`purpose` sets how the whole flow can be dismissed, matching `Dialog`. Leave it out and the step that is showing decides: `info` allows Escape, a scrim click, and a swipe, `form` allows Escape only so typed input is not thrown away, and `required` blocks every implicit path. `hasScrim` defaults to `true` and draws one scrim for the entire flow; it stays up while steps change and only goes away when the flow closes, which is what makes a multi-step flow feel like one surface instead of several dialogs.

Escape asks the switcher to close. `cancel` fires first with the native cancel event, so calling `event.preventDefault()` on it keeps the flow open.

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
