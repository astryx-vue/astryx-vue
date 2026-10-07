---
layout: component-docs
title: Banner
outline: false
footer: false
---

<script setup lang="ts">
import { bannerStatuses, bannerDetails, bannerActions, bannerContainers } from '../../../../components/demos/banner'
</script>

## Usage

Use `Banner` for persistent messages that require attention or action.

```vue
<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <Banner
    status="success"
    title="Changes saved"
    description="Your settings are up to date."
    is-dismissable
  />
</template>
```

Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

## Examples

<DemoExample :demo="bannerStatuses" title="Message states" description="Describe the message in the title. Do not rely on color alone." locale="en" />

<DemoExample :demo="bannerDetails" title="Details" description="The default slot provides details. Set collapsible to false to keep them visible." locale="en" />

<DemoExample :demo="bannerActions" title="Actions and dismissal" description="Put actions in the end slot. Dismissal hides the component." locale="en" />

<DemoExample :demo="bannerContainers" title="Containers and elevation" description="Use card inside page content. Use section for full-width notices." locale="en" />

## Usage guidance

- Use `info` for information.
- Use `success` for successful results.
- Use `warning` for caution.
- Use `error` for problems that block progress.
- Set `:collapsible="false"` for details that users must read.
- Mount urgent messages in response to user actions.

`warning` and `error` use `role="alert"`.
`info` and `success` use `role="status"`.
Messages in the initial page render may not be announced by screen readers.

For a single field validation message, use [FieldStatus](/en/components/field).
