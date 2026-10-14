---
layout: component-docs
title: Spinner
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { spinnerLabel, spinnerMedia, spinnerSizes } from '../../../../components/demos/spinner'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Provide a meaningful label to describe what is loading for screen reader users. |
| <Badge variant="success">Do</Badge> | Use the "onMedia" shade when placed on dark or accent-colored backgrounds. |
| <Badge variant="error">Don't</Badge> | Use for content areas with known dimensions; use Skeleton to preserve layout instead. |
| <Badge variant="error">Don't</Badge> | Stack multiple spinners in the same view; use one to represent the overall loading state. |

## Examples

<DemoExample :demo="spinnerMedia" title="On media" description="default sits on a light surface. onMedia sits on a dark surface." locale="en" />

<DemoExample :demo="spinnerSizes" title="Sizes" description="sm, md, lg, and xl." locale="en" />

<DemoExample :demo="spinnerLabel" title="With label" description="A short label, or a title and a supporting line. The accessible name stays Fetching data when the label is rich." locale="en" />

## Accessibility

A `Spinner` has no visible text of its own, so its loading state reaches assistive technology entirely through ARIA attributes. The component sets these for you, and you normally do not need to manage them yourself; the list below covers the attributes it actually uses and what each one does.

- The root element carries `role="status"`, so assistive technology treats it as a status region.
- When you pass a string `label`, it shows as visible text below the spinner and provides the accessible name through `aria-labelledby`.
- Without a `label`, the accessible name defaults to `Loading`; pass `aria-label` to change it to something more specific to the context.
- The ring is `aria-hidden` and carries no text of its own, so it is not read out separately.
- With reduced motion enabled, the arc slows to a 3-second cycle.
