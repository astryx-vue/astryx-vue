---
layout: component-docs
title: 数字输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { numberInputBasic, numberInputPrecision, numberInputSizes } from '../../../../components/demos/number-input'
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
  <NumberInput v-model="count" :min="0" :max="100" />
</template>
```

通过 `min` 和 `max` 属性设置数值范围，`step` 设置每次增减的步长。超出范围的值会被限制在有效区间内。步进按钮使用向上和向下的箭头。按钮的无障碍名称默认是英文，调用 `provideAstryxLocale('zh-CN')` 后改为中文；如果传了 `label`，名称里会带上它。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为数值范围明确的场景设置 `min` 和 `max`。 |
| <Badge variant="success">推荐</Badge> | 根据实际需求设置合理的步长，如数量用 1，价格用 0.01。 |
| <Badge variant="success">推荐</Badge> | 在标签中说明单位（如"数量（件）"），而不是把单位放在输入框内。 |
| <Badge variant="error">避免</Badge> | 对大范围数值使用过小的步长，会让用户点击按钮很多次。 |

## 示例

<DemoExample
  :demo="numberInputBasic"
  description="绑定数字值，通过按钮或键盘方向键增减，自动限制在最小最大值范围内。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="numberInputPrecision"
  description="用 min 和 max 限制可输入范围，用 step 控制每次点击增减的幅度。"
  locale="zh"
  title="范围与步长"
/>

<DemoExample
  :demo="numberInputSizes"
  description="提供 sm、md、lg 三种尺寸，默认为 md。"
  locale="zh"
  title="不同尺寸"
/>
