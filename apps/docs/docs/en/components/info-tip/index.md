---
layout: component-docs
title: InfoTip
outline: false
footer: false
---

## Usage

`InfoTip` is a small "i" button that previews help text on hover or keyboard focus. Put it next to labels, values, and metrics.

```vue
<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
</script>

<template>
  <InfoTip content="30-day rolling average." label="About this metric" />
</template>
```

## Accessibility

The button is named by `label` (default "More information") and is described by the tooltip bubble through `aria-describedby`.
