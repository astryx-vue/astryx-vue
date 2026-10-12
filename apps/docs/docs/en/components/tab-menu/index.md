---
layout: component-docs
title: Tab Menu
outline: false
footer: false
---

<script setup lang="ts">
import { tabMenuBasic, tabMenuShowcase } from '../../../../components/demos/tab-menu'
</script>

## Usage

`TabMenu` collects tabs that do not fit on the `TabList`. It has to be a child of `TabList`. Arrow keys move onto the trigger without changing the selected tab. Enter or Space opens the menu. The menu items are `menuitemradio` controls, and choosing one selects that tab through the list.

`label` is the trigger text when none of the options is selected, and the menu's accessible name. When an option is the selected tab, the trigger shows that option's label and takes the selected tab style. `iconClass` is a CSS icon class on an option, for example `i-carbon-settings`.

```vue
<script setup lang="ts">
import { Tab, TabList, TabMenu } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
    <TabMenu
      label="More"
      :options="[
        { value: 'settings', label: 'Settings' },
        { value: 'billing', label: 'Billing' },
      ]"
    />
  </TabList>
</template>
```

## Examples

<DemoExample :demo="tabMenuBasic" description="Overview and Activity stay on the list. Settings and Billing sit in More." locale="en" title="Basic" />
<DemoExample :demo="tabMenuShowcase" description="Settings is already selected, so the trigger reads Settings and shows the selected tab style." locale="en" title="Tab menu" />
