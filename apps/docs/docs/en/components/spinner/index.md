---
layout: component-docs
title: Spinner
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Provide a meaningful label to describe what is loading for screen reader users. |
| <Badge variant="success">Do</Badge> | Use the "onMedia" shade when placed on dark or accent-colored backgrounds. |
| <Badge variant="error">Don't</Badge> | Use for content areas with known dimensions; use Skeleton to preserve layout instead. |
| <Badge variant="error">Don't</Badge> | Stack multiple spinners in the same view; use one to represent the overall loading state. |

## Examples

<DemoExample :demo="spinnerBasic" title="Basic" description="The default spinner uses the accent color and the md size." locale="en" />

<DemoExample :demo="spinnerSizes" title="Sizes" description="Use sm, md, lg, or xl. The ring diameter is 10px, 14px, 18px, or 28px." locale="en" />

<DemoExample :demo="spinnerShades" title="Shades" description="default and subtle suit light backgrounds. onMedia suits dark or accent backgrounds. inherit takes the surrounding text color." locale="en" />

<DemoExample :demo="spinnerLabel" title="Label" description="A visible label appears below the spinner and names it for screen readers." locale="en" />

## Accessibility

A `Spinner` has no visible text of its own, so its loading state reaches assistive technology entirely through ARIA attributes. The component sets these for you, and you normally do not need to manage them yourself; the list below covers the attributes it actually uses and what each one does.

- The root element carries `role="status"`, so assistive technology treats it as a status region.
- When you pass a string `label`, it shows as visible text below the spinner and provides the accessible name through `aria-labelledby`.
- Without a `label`, the accessible name defaults to `Loading`; pass `aria-label` to change it to something more specific to the context.
- The ring is `aria-hidden` and carries no text of its own, so it is not read out separately.
- With reduced motion enabled, the arc slows to a 3-second cycle.
