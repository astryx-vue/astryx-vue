---
layout: component-docs
title: Button Group
outline: false
footer: false
---

<script setup lang="ts">
import { buttonGroupBasic, buttonGroupFloating } from '../../../../components/demos/button-group'
</script>


## Usage

`ButtonGroup` connects related buttons into one group. Buttons have no gap. Separators distinguish adjacent buttons:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
</script>

<template>
  <ButtonGroup label="Editing actions">
    <Button label="Copy" />
    <Button label="Cut" />
    <Button label="Paste" />
  </ButtonGroup>
</template>
```

## Examples

<DemoExample
  :demo="buttonGroupBasic"
  description="Keep 2–4 closely related actions together and use a consistent variant so they read as one connected control."
  locale="en"
  title="Basic group"
/>

<DemoExample
  :demo="buttonGroupFloating"
  description="Elevation belongs to the whole group rather than an individual member, so the connected controls rise as one floating surface."
  locale="en"
  title="Floating group"
/>

