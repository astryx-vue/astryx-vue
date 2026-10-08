---
layout: component-docs
title: Tab List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tabListBasic, tabListDivider, tabListSizes } from '../../../../components/demos/tab-list'
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
  :demo="tabListBasic"
  description="A basic tab list that switches the selected value on click."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="tabListSizes"
  description="Tabs come in sm, md, and lg sizes."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="tabListDivider"
  description="Use has-divider to add a bottom border to the tab list."
  locale="en"
  title="With divider"
/>
