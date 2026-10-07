---
layout: component-docs
title: 单选列表
outline: false
footer: false
---

<script setup lang="ts">
import { radioList } from '../../../../components/demos/radio'
</script>

## 使用方法

`RadioList` 是 `RadioGroup` 的便捷封装。它接收 `options` 数组，自动渲染一组单选按钮。

```vue
<script setup lang="ts">
import { RadioList } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const plan = shallowRef('team')
const options = [
  { value: 'free', label: 'Free', description: 'For personal projects.' },
  { value: 'team', label: 'Team', description: 'For small teams.' },
  { value: 'enterprise', label: 'Enterprise', description: 'For organizations.' },
]
</script>

<template>
  <RadioList v-model="plan" label="Plan" :options="options" />
</template>
```

## 示例

<DemoExample :demo="radioList" title="基本用法" description="传入 options 数组即可渲染带说明的单选列表。" locale="zh" />

## 键盘与无障碍

- 与 RadioGroup 共享相同的键盘操作和 ARIA 结构。
- 自动为每个选项生成 ID。
- 必须提供组 `label`。

## 使用建议

- 选项结构简单且无需自定义布局时，优先使用 RadioList。
- 需要自定义选项渲染或复杂布局时，使用 [RadioGroup](/components/radio-group) 配合 Radio 子项。
