---
layout: component-docs
title: Progress Bar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { progressBarBasic, progressBarIndeterminate, progressBarSizes, progressBarVariants } from '../../../../components/demos/progress-bar'
</script>

## Usage

`ProgressBar` shows the completion ratio of an operation.

```vue
<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <ProgressBar :value="60" label="Upload" show-value />
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts. |
| <Badge variant="error">Don't</Badge> | Place icons or labels inside the bar; compose them alongside it using layout components. |
| <Badge variant="error">Don't</Badge> | Use multiple progress bars stacked together for the same operation; use one bar with a value label instead. |

## Examples

<DemoExample :demo="progressBarBasic" title="Basic" description="Use value and max to control completion. show-value displays the percentage." locale="en" />

<DemoExample :demo="progressBarSizes" title="Sizes" description="Progress bars come in sm, md, and lg track heights." locale="en" />

<DemoExample :demo="progressBarVariants" title="Color variants" description="Use different colors to match the state." locale="en" />

<DemoExample :demo="progressBarIndeterminate" title="Indeterminate" description="Use isIndeterminate for loading states with unknown progress." locale="en" />

## Accessibility

A progress bar has no focusable element, so screen reader users rely on the ARIA attributes the component exposes to learn the current progress. The component therefore puts `role="progressbar"` on the track and fills in the progress values and name, so assistive technologies can announce it accurately:

- The progress range is described by `aria-valuemin` and `aria-valuemax`, which the component sets automatically from `min` and `max`.
- The current progress is described by `aria-valuenow`, which is also set automatically.
- When `label` is provided, the label is linked to the track through `aria-labelledby`.
- When `description` is provided, the description is linked to the track through `aria-describedby`.

When `isIndeterminate` is true the progress is unknown, so the component removes `aria-valuenow` and screen readers announce the bar without a specific value.
