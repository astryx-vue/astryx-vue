---
layout: component-docs
title: 切换按钮组
outline: false
footer: false
---

<script setup lang="ts">
import { toggleButtonGroupSelection, toggleButtonGroupVertical } from '../../../../components/demos/toggle-button-group'
</script>

## 使用方法

`ToggleButtonGroup` 管里面 `ToggleButton` 的按下状态。每个按钮都要有 `value`。组的 `v-model:value` 会盖过按钮自己的按下状态。

`type="single"` 同时只按下一个。再点一次会清空，值变成 `null`。`type="multiple"` 每个按钮各自按下，值是数组。`orientation` 是 `horizontal` 或 `vertical`。`label` 是这一组的无障碍名称。

```vue
<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('grid')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton label="List" value="list" />
    <ToggleButton label="Grid" value="grid" />
    <ToggleButton label="Board" value="board" />
  </ToggleButtonGroup>
</template>
```

## 示例

<DemoExample
  :demo="toggleButtonGroupSelection"
  description="单选和多选两种开关组。单选用来切换视图，多选组成格式工具栏。"
  locale="zh"
  title="分组"
/>

<DemoExample
  :demo="toggleButtonGroupVertical"
  description="垂直排列的开关组，同时展示单选和多选。适合侧栏式选项和垂直工具栏。"
  locale="zh"
  title="垂直"
/>
