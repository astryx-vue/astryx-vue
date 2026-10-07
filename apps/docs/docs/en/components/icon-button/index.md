---
layout: component-docs
title: Icon Button
outline: false
footer: false
---

<script setup lang="ts">
import { iconButtonActionBar, iconButtonAsync, iconButtonFloating, iconButtonTooltips } from '../../../../components/demos/icon-button'
</script>


## Usage

`IconButton` displays one icon. The icon must clearly identify the action. Set `label` to provide an accessible name:

```vue
<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <IconButton label="Search">
    <span class="i-carbon-search" />
  </IconButton>
</template>
```

Use a text-bearing [Button](/en/components/button) when the action is not immediately clear.

## Examples

<DemoExample
  :demo="iconButtonActionBar"
  description="Use low-emphasis icon-only buttons in an action bar to keep frequent controls compact."
  locale="en"
  title="Action bar"
/>

<DemoExample
  :demo="iconButtonFloating"
  description="Icon-only controls are a common floating-action shape. Set elevation=&quot;high&quot; to emphasize the floating action."
  locale="en"
  title="Floating action"
/>

<DemoExample
  :demo="iconButtonAsync"
  description="The button shows a loading indicator during asynchronous work and prevents duplicate activation until it settles."
  locale="en"
  title="Async state"
/>

<DemoExample
  :demo="iconButtonTooltips"
  description="A tooltip explains the icon to sighted users, but it never replaces the required label."
  locale="en"
  title="Tooltip"
/>

