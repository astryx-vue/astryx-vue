---
layout: component-docs
title: 数字输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`NumberInput` 是一个专门用于数字输入的组件，提供步进按钮、最小最大值限制、精度控制等功能。用户可以手动输入数字，也可以点击按钮增减。

基本用法只需要绑定一个数字值：

```vue
<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <NumberInput v-model="count" />
</template>
```

通过 `min` 和 `max` 属性设置数值范围，`step` 设置每次增减的步长：

```vue
<template>
  <NumberInput v-model="count" :min="0" :max="100" :step="5" />
</template>
```

通过 `precision` 控制小数位数，适用于价格、评分等场景：

```vue
<template>
  <NumberInput v-model="price" :precision="2" :step="0.01" />
</template>
```

组件自动处理输入验证，超出范围的值会被限制在有效区间内。支持鼠标滚轮调整、键盘方向键调整等交互方式。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为数值范围明确的场景设置 `min` 和 `max`。 |
| <Badge variant="success">推荐</Badge> | 根据实际需求设置合理的步长，如数量用 1，价格用 0.01。 |
| <Badge variant="success">推荐</Badge> | 在标签中说明单位（如"数量（件）"），而不是把单位放在输入框内。 |
| <Badge variant="error">避免</Badge> | 对大范围数值使用过小的步长，会让用户点击按钮很多次。 |
| <Badge variant="error">避免</Badge> | 在需要精确输入的场景禁用手动输入。 |

## 示例

数字输入框组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 当前值 |
| `min` | `number` | `-Infinity` | 最小值 |
| `max` | `number` | `Infinity` | 最大值 |
| `step` | `number` | `1` | 步长 |
| `precision` | `number` | - | 小数位数 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | 状态 |
| `placeholder` | `string` | - | 占位符 |

## Emits

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | 值变化时触发 |
| `change` | `value: number` | 值变化时触发 |
| `blur` | `event: FocusEvent` | 失去焦点时触发 |
| `focus` | `event: FocusEvent` | 获得焦点时触发 |

## Slots

| 名称 | 说明 |
| --- | --- |
| `prepend` | 输入框前置内容 |
| `append` | 输入框后置内容 |

## 键盘交互

| 按键 | 功能 |
| --- | --- |
| `ArrowUp` | 增加一个步长 |
| `ArrowDown` | 减少一个步长 |
| `PageUp` | 增加十个步长 |
| `PageDown` | 减少十个步长 |
| `Home` | 跳到最小值 |
| `End` | 跳到最大值 |

## 无障碍

- 使用原生 `<input type="number">` 的语义
- 支持 `aria-valuemin`、`aria-valuemax`、`aria-valuenow`
- 支持屏幕阅读器读取当前值和范围
- 按钮包含合适的 `aria-label`
