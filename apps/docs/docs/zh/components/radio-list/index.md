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

`RadioList` 内部把渲染工作交给 [RadioGroup](/components/radio-group)，所以键盘操作和 ARIA 结构与 RadioGroup 完全一致，在两者之间切换时不需要重新适应交互方式。

- 整组渲染为一个 `role="radiogroup"` 容器，屏幕阅读器会按单选组的语义朗读它。
- 每个选项的 ID 由组件自动生成，你不需要手动指定。
- 组 `label` 是必填项，它是整组的无障碍名称，屏幕阅读器靠它说明这组选项在让人选什么。

## 使用建议

选项结构简单、也不需要自定义布局时，优先使用 `RadioList`：它只接收一个 `options` 数组，就能把整组选项渲染出来。

需要自定义选项渲染，或者布局比较复杂时，改用 [RadioGroup](/components/radio-group) 并直接组合 Radio 子项。
