---
layout: component-docs
title: 数字输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { numberInputClearable, numberInputRange, numberInputStatus, numberInputUnits } from '../../../../components/demos/number-input'
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
  :demo="numberInputClearable"
  description="进度从 0 到 100，带百分号和清除按钮。"
  locale="zh"
  title="可清除"
/>

<DemoExample
  :demo="numberInputRange"
  description="团队人数限制在 1 到 50，并说明这个数字代表什么。"
  locale="zh"
  title="范围"
/>

<DemoExample
  :demo="numberInputStatus"
  description="预算、人数和完成度上的错误、警告和成功。"
  locale="zh"
  title="校验状态"
/>

<DemoExample
  :demo="numberInputUnits"
  description="带百分号的折扣，范围是 0 到 100。"
  locale="zh"
  title="单位"
/>
