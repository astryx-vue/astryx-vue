---
layout: component-docs
title: Tab
outline: false
footer: false
---

<script setup lang="ts">
import { tabSelectedIcon } from '../../../../components/demos/tab'
</script>

## Usage

Individual tab item that renders as a button or an anchor link, with selected-state styling and optional icons.

A `Tab` reads the selection and the size from the surrounding `TabList`, so it always renders inside one. The default slot is the label. `icon` shows while the tab is not selected and `selectedIcon` while it is; `endContent` follows the label for a badge or a status dot. With `href` the tab renders as a link, unless the strip is a `role="tablist"` and the tab points at its panel with `panelId` instead.

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      Inbox
    </Tab>
    <Tab value="sent">
      Sent
    </Tab>
  </TabList>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="tabSelectedIcon" title="Selected Icon" description="A tab that changes its icon when selected." locale="en" />
