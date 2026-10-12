---
layout: component-docs
title: 标签菜单
outline: false
footer: false
---

<script setup lang="ts">
import { tabMenuBasic } from '../../../../components/demos/tab-menu'
</script>

## 使用方法

`TabMenu` 把放不下的标签收进 `TabList` 末尾的菜单。它必须是 `TabList` 的子组件。方向键可以移到触发器上，但不会因此改掉当前标签。Enter 或 Space 打开菜单。菜单项是 `menuitemradio`，选中一项会通过列表选中对应的标签。

`label` 是没有选项被选中时的触发器文字，也是菜单的无障碍名称。某个选项就是当前标签时，触发器改显示这个选项的文字，并带上选中标签的样式。`iconClass` 是选项上的 CSS 图标类，例如 `i-carbon-settings`。

```vue
<script setup lang="ts">
import { Tab, TabList, TabMenu } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      Overview
    </Tab>
    <Tab value="activity">
      Activity
    </Tab>
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

## 示例

<DemoExample :demo="tabMenuBasic" description="Overview 和 Activity 留在标签条上。Settings 和 Billing 收在 More 里。" locale="zh" title="基本用法" />
