---
layout: component-docs
title: Spinner
outline: false
footer: false
---

<script setup lang="ts">
import { spinnerBasic, spinnerLabel, spinnerShades, spinnerSizes } from '../../../../components/demos/spinner'
</script>

## Usage

`Spinner` shows a loading state when the duration of a process is unknown.

```vue
<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <Spinner label="Loading data" />
</template>
```

## Examples

<DemoExample :demo="spinnerBasic" title="Basic" description="The default spinner uses the accent color and the md size." locale="en" />

<DemoExample :demo="spinnerSizes" title="Sizes" description="Use sm, md, lg, or xl. The ring diameter is 10px, 14px, 18px, or 28px." locale="en" />

<DemoExample :demo="spinnerShades" title="Shades" description="default and subtle suit light backgrounds. onMedia suits dark or accent backgrounds. inherit takes the surrounding text color." locale="en" />

<DemoExample :demo="spinnerLabel" title="Label" description="A visible label appears below the spinner and names it for screen readers." locale="en" />

## Accessibility

- The root element has `role="status"`.
- A string `label` provides the accessible name through `aria-labelledby`.
- Without `label`, the default name is `Loading`. Set `aria-label` to change it.
- The ring is `aria-hidden` and carries no text of its own.
- With reduced motion enabled, the arc slows to a 3-second cycle.
