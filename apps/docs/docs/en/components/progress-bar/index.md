---
layout: component-docs
title: Progress Bar
outline: false
footer: false
---

<script setup lang="ts">
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

## Examples

<DemoExample :demo="progressBarBasic" title="Basic" description="Use value and max to control completion. show-value displays the percentage." locale="en" />

<DemoExample :demo="progressBarSizes" title="Sizes" description="Progress bars come in sm, md, and lg track heights." locale="en" />

<DemoExample :demo="progressBarVariants" title="Color variants" description="Use different colors to match the state." locale="en" />

<DemoExample :demo="progressBarIndeterminate" title="Indeterminate" description="Use isIndeterminate for loading states with unknown progress." locale="en" />

## Accessibility

- The track has `role="progressbar"`.
- `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` are set automatically.
- `label` is linked through `aria-labelledby`.
- `description` is linked through `aria-describedby`.
- `aria-valuenow` is removed when `isIndeterminate` is true.
