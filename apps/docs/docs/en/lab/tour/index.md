---
title: Tour
---

# Tour

Tour introduces features through a sequence of steps anchored to elements on the page. `Tour` owns the active step, `TourStep` renders the target highlight and callout, and `useTour` exposes the same state to custom step UI. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labTour } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTour" description="Start the tour and move through three actions with Next, Back, Done, the close button, or Escape." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { Tour, TourStep, useTour } from '@astryx-vue/lab'
```

## Start and dismiss

The caller controls `isActive`. The component does not persist “already seen” state or rewrite that prop after `dismiss`. Close it in the callback and use the reason to decide what to persist:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref(false)
function dismiss(source) {
  active.value = false
  // complete means finished; backdrop, close, and escape leave early.
}
</script>
```

Reactivating starts at the first step. `backdrop` is a press on the dimmed page (the target included), `close` is the step's close button, `escape` is the Escape key, and `complete` is Done on the final step. Custom UI can call `useTour().dismiss('skip')` to skip.

## Tour props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `isActive` | `boolean` | Required | Whether the tour is running. Inactive steps do not render, and the tour resets to the first step. |
| `hasBackdrop` | `boolean` | `false` | Dims the page around the target while leaving its spotlight clear; a press anywhere outside the callout, the target included, then ends the tour with `backdrop`. Off shows only the highlight ring, so the user can press the target the step introduces. |
| `isStepCountShown` | `boolean` | `false` | Shows the current step and total, such as `2 of 3`. |

The `dismiss` event carries a `TourDismissSource`. Step order follows the `TourStep` children; no separate step array is needed.

Each step's callout is a non-modal region named by its heading. Focus moves to it when a step starts, and Tab can leave it for the page, so a step can introduce a control the user then operates. When the tour ends, focus returns to the target if it can take focus, otherwise to the element that had focus when the tour started.

## TourStep props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `targetRef` | `MaybeRef<HTMLElement \| null>` | Required | A template ref to the target, or the element itself: any element, such as a button, a card, a table cell, or a chart region. The target keeps its own behavior: without a backdrop, pressing it does not end the tour. |
| `heading` | `string` | Required | The step heading and the callout's accessible name. |
| `placement` | `'above' \| 'below' \| 'start' \| 'end'` | `'below'` | Which side of the target the callout uses; it flips when space runs out. |
| `alignment` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along that side. |

Use the default slot for body copy. The highlight is a separate element and never changes the target's classes or styles. It is measured again on scroll and resize.

## useTour

Inside a `Tour`, `useTour()` returns `activeStepIndex`, `stepCount`, `isFirstStep`, `isLastStep`, and the `next()`, `previous()`, and `dismiss(source)` actions. Outside a `Tour`, it returns `null`.
