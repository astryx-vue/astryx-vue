---
layout: component-docs
title: 日历
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarBasic, calendarRange } from '../../../../components/demos/calendar'
</script>

## 使用方法

`Calendar` 是一个日期选择日历组件，以网格形式展示一个月的日期，用户可以点击选择日期。支持键盘导航、日期范围限制、禁用日期等功能。

基本用法只需要绑定一个日期值：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@astryx-vue/core/Calendar'
import { today } from '@internationalized/date'

const date = ref(today('Asia/Shanghai'))
</script>

<template>
  <Calendar v-model="date" />
</template>
```

日期值使用 `@internationalized/date` 库的 `CalendarDate` 类型，这是一个不含时区的纯日期表示，避免了原生 `Date` 对象的时区问题。

通过 `minValue` 和 `maxValue` 限制可选日期范围，通过 `isDateUnavailable` 函数禁用特定日期。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为业务场景设置合理的日期范围限制。 |
| <Badge variant="success">推荐</Badge> | 使用 `isDateUnavailable` 禁用不可选的日期。 |
| <Badge variant="success">推荐</Badge> | 使用 `@internationalized/date` 而不是原生 `Date`，避免时区问题。 |
| <Badge variant="error">避免</Badge> | 在日历上层叠过多的装饰或自定义内容，保持日期网格清晰。 |

## 示例

<DemoExample
  :demo="calendarBasic"
  description="点击日期选择，方向键导航，Enter 确认，支持完整的键盘交互。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="calendarRange"
  description="通过 minValue 和 maxValue 限制可选日期范围，超出范围的日期自动禁用。"
  locale="zh"
  title="限制日期范围"
/>
