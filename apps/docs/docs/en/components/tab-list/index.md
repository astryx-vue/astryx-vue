---
layout: component-docs
title: Tab List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tabListActions, tabListBadges, tabListFill, tabListIcons, tabListOverflow, tabListStatus } from '../../../../components/demos/tab-list'
</script>

## Usage

Import `TabList` and `Tab` from their dedicated entry and control selection with `v-model:value`.

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      Overview
    </Tab>
    <Tab value="props">
      Props
    </Tab>
    <Tab value="examples">
      Examples
    </Tab>
  </TabList>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Use semantic `role="tablist"`, `role="tab"`, and `aria-selected` for accessible tabs. |
| <Badge variant="success">Recommended</Badge> | Give each `Tab` a unique `value` for selection and keyboard navigation. |
| <Badge variant="success">Recommended</Badge> | Use `disabled` for unavailable tabs; keyboard navigation skips them automatically. |
| <Badge variant="error">Don't</Badge> | Put too many tabs in a single strip; consider scrolling or reorganizing content when it overflows. |
| <Badge variant="error">Don't</Badge> | Use TabList for page-level navigation; Breadcrumbs or Link are better for wayfinding. |

## Examples

<DemoExample
  :demo="tabListFill"
  description="With layout set to fill, the tabs share the width of the row and a divider sits under the list."
  locale="en"
  title="Fill layout"
/>

<DemoExample
  :demo="tabListActions"
  description="Tabs stay on the left and the filter and create buttons sit on the right. With a divider, the buttons use the same size as the tabs."
  locale="en"
  title="With actions"
/>

<DemoExample
  :demo="tabListBadges"
  description="A badge after the label. Error is for a count that needs attention; neutral is for an ordinary count."
  locale="en"
  title="With badge"
/>

<DemoExample
  :demo="tabListIcons"
  description="An icon before the label, so each tab is recognizable before the word is read."
  locale="en"
  title="With icons"
/>

<DemoExample
  :demo="tabListOverflow"
  description="Tabs that do not fit inline go into a TabMenu. Choosing one makes it the selected tab."
  locale="en"
  title="With overflow menu"
/>

<DemoExample
  :demo="tabListStatus"
  description="A status dot after the label shows whether an environment is healthy."
  locale="en"
  title="With status dot"
/>
