---
layout: component-docs
title: 标签
outline: false
footer: false
---

<script setup lang="ts">
import { tabSelectedIcon } from '../../../../components/demos/tab'
</script>

## 使用方法

标签页里的一个标签。它渲染成按钮或者链接，选中时换一套样式，还能带图标。

`Tab` 的选中状态和尺寸都从外面的 `TabList` 读，所以要放在 `TabList` 里用。默认插槽是标签文字。没选中时显示 `icon`，选中时换成 `selectedIcon`；`endContent` 跟在文字后面，用来放徽标或状态点。写了 `href` 就渲染成链接；如果外层是 `role="tablist"`，那它就用 `panelId` 指向自己那块内容面板。

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      收件箱
    </Tab>
    <Tab value="sent">
      已发送
    </Tab>
  </TabList>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="tabSelectedIcon" title="选中换图标" description="选中之后图标会换一个的标签。" locale="zh" />
