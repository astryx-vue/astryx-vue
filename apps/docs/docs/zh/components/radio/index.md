---
layout: component-docs
title: 单选按钮
outline: false
footer: false
---

<script setup lang="ts">
import { radioBasic, radioList, radioStates } from '../../../../components/demos/radio'
</script>

## 使用方法

`Radio` 表示一个单选选项。它必须放在 `RadioGroup` 中使用，由 RadioGroup 通过 `provide/inject` 管理选中状态。

```vue
<script setup lang="ts">
import { Radio, RadioGroup } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const size = shallowRef('md')
</script>

<template>
  <RadioGroup v-model="size" label="Size">
    <Radio value="sm" label="Small" />
    <Radio value="md" label="Medium" />
    <Radio value="lg" label="Large" />
  </RadioGroup>
</template>
```

## 示例

<DemoExample :demo="radioBasic" title="基本用法" description="在 RadioGroup 中放置 Radio 子项。v-model 绑定当前选中的值。" locale="zh" />

<DemoExample :demo="radioList" title="单选列表" description="RadioList 接收 options 数组，快速渲染一组选项。" locale="zh" />

<DemoExample :demo="radioStates" title="禁用选项" description="单个选项可以禁用，不影响组内其他选项。" locale="zh" />

## 键盘操作

- Tab：聚焦单选组。
- 方向键：在组内移动选中项。
- Space：选中当前聚焦项。

## 使用建议

- 选项数量较少且 mutually exclusive 时使用单选组。
- 选项超过约 7 个时，考虑使用下拉选择。
- 必须提供组标签 `label`。
