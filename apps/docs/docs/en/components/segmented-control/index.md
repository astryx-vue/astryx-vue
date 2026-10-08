---
layout: component-docs
title: Segmented Control
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { segmentedControlBasic, segmentedControlIcons, segmentedControlSizes, segmentedControlStates } from '../../../../components/demos/segmented-control'
</script>

## Usage

`SegmentedControl` lays a small set of mutually exclusive options out in one row, with exactly one of them selected at all times. It looks like a tab bar but behaves like a radio group: the choice is a value or a mode, not a page. Because every option is visible at once, the user can compare them without opening anything first.

```vue
<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('overview')
</script>

<template>
  <SegmentedControl v-model="view" label="Workspace view">
    <SegmentedControlItem label="Overview" value="overview" />
    <SegmentedControlItem label="Activity" value="activity" />
    <SegmentedControlItem label="Members" value="members" />
  </SegmentedControl>
</template>
```

The selection is bound two ways with `v-model`. The control renders as a `role="radiogroup"` container, and `label` goes to `aria-label` — it names the group for screen readers and is never drawn on screen. Each `SegmentedControlItem` renders as a `role="radio"` button whose `aria-checked` reports whether it is the selected one.

Keyboard behavior follows the radio group convention: the left and right arrows move between segments, `Home` and `End` jump to the first and last enabled segment, and movement wraps at the ends. Selection follows focus, so the segment the arrow keys land on becomes the selected one. Only one segment is in the tab order at a time (a roving tabindex), so Tab moves past the whole control instead of stopping on every segment. Disabled segments are skipped by both the arrow keys and the tab order.

`size` offers `sm`, `md`, and `lg`, defaulting to `md`. `layout` defaults to `hug`, where the control and each segment take their content width and never exceed the container: when the container is too narrow the labels truncate with an ellipsis instead of pushing the control past the edge. Switch it to `fill` and the segments share the full width evenly, which suits a narrow card.

`isDisabled` disables the whole control: no segment can be selected and the control leaves the tab order. When you also need to say why, use `disabledMessage` rather than wrapping the control in a `Tooltip` — a disabled control swallows the pointer events an external tooltip needs. With a message the control stays reachable through `aria-disabled`, so both mouse and keyboard users can discover the reason, while selection stays blocked. To disable one segment on its own, set `isDisabled` on that `SegmentedControlItem`.

A segment can show an icon before its label by putting it in the `#icon` slot; the icon follows the size of the control. Set `isLabelHidden` to show the icon alone, and the `label` becomes the segment's `aria-label` so its name is not lost.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use it to switch between two to five mutually exclusive views or modes where every option should be visible at once. |
| <Badge variant="success">Do</Badge> | Always set `label` to say in a sentence what the group controls, such as "Workspace view". Screen reader users need it to know what they are choosing between. |
| <Badge variant="success">Do</Badge> | Keep the labels short. Labels truncate in narrow containers, and two or three words stay readable on a phone. |
| <Badge variant="success">Do</Badge> | Explain a disabled control with `disabledMessage`, so keyboard users can read the reason too. |
| <Badge variant="error">Don't</Badge> | Use it for page-level navigation. That is what `TabList` is for: a tab list switches a content region, while a segmented control is an input that always has exactly one selected option. |
| <Badge variant="error">Don't</Badge> | Use it for a simple on/off state. A switch is toggled independently, whereas a segmented control enforces one selection from a group. |
| <Badge variant="error">Don't</Badge> | Wrap a disabled segmented control in a `Tooltip`. A disabled control does not emit the pointer events the wrapper listens for; use `disabledMessage` instead. |
| <Badge variant="error">Don't</Badge> | Cram in more than five segments, or mix labels of very different lengths. The more options there are, the more the user has to read before choosing. |

## Examples

<DemoExample
  :demo="segmentedControlBasic"
  description="The basic case: a controlled row of segments, with the line underneath following the selection."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="segmentedControlSizes"
  description="The sm, md, and lg sizes change only the height and inner padding, never the behavior."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="segmentedControlIcons"
  description="A segment can carry an icon before its label; with isLabelHidden it shows the icon alone and the label becomes the segment's accessible name."
  locale="en"
  title="Icons"
/>

<DemoExample
  :demo="segmentedControlStates"
  description="One disabled segment, a whole control disabled with a reason, and the fill layout sharing the width of a narrow card."
  locale="en"
  title="States and layout"
/>
