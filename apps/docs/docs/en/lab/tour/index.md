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

Reactivating starts at the first step. `backdrop` is a backdrop click, `close` is the close button or the Popover close request, and `complete` is Done on the final step. Custom UI can call `useTour().dismiss('skip')` to skip.

## Tour props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `isActive` | `boolean` | Required | Whether the tour is running. Inactive steps do not render, and the tour resets to the first step. |
| `hasBackdrop` | `boolean` | `false` | Dims the page around the target while leaving its spotlight clear. Off shows only the highlight ring. |
| `isStepCountShown` | `boolean` | `false` | Shows the current step and total, such as `2 of 3`. |

The `dismiss` event carries a `TourDismissSource`. Step order follows the `TourStep` children; no separate step array is needed.

## TourStep props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `targetRef` | `MaybeRef<HTMLElement \| null>` | Required | A template ref to the target element; the element itself is also accepted. |
| `heading` | `string` | Required | The step heading and the callout's accessible name. |
| `placement` | `'above' \| 'below' \| 'start' \| 'end'` | `'below'` | Which side of the target the callout uses; Popover flips it when space runs out. |
| `alignment` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along that side. |

Use the default slot for body copy. The highlight is a separate element and never changes the target's classes or styles. It is measured again on scroll and resize.

## useTour

Inside a `Tour`, `useTour()` returns `activeStepIndex`, `stepCount`, `isFirstStep`, `isLastStep`, and the `next()`, `previous()`, and `dismiss(source)` actions. Outside a `Tour`, it returns `null`.
