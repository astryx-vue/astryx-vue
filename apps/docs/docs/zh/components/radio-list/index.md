---
layout: component-docs
title: 单选列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项数量保持较少，通常为 2 到 7 个。 |
| <Badge variant="success">推荐</Badge> | 使用清晰、简洁的标签，让每个选项一眼可辨。 |
| <Badge variant="error">避免</Badge> | 需要多选时使用单选列表。应改用 CheckboxList。 |
| <Badge variant="error">避免</Badge> | 用于长列表。应使用 Selector，便于查找。 |
| <Badge variant="error">避免</Badge> | 超过 4 个选项时使用水平布局，排版会很别扭。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的 RadioList 来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample :demo="radioList" title="基本用法" description="传入 options 数组即可渲染带说明的单选列表。" locale="zh" />

## 键盘与无障碍

- 与 RadioGroup 共享相同的键盘操作和 ARIA 结构。
- 自动为每个选项生成 ID。
- 必须提供组 `label`。

## 使用建议

- 选项结构简单且无需自定义布局时，优先使用 RadioList。
- 需要自定义选项渲染或复杂布局时，使用 [RadioGroup](/components/radio-group) 配合 Radio 子项。
