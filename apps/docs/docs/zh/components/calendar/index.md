---
layout: component-docs
title: 日历
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarConstraints, calendarRange, calendarSingle, calendarTwoMonths } from '../../../../components/demos/calendar'
</script>

## 使用方法

`Calendar` 用月历网格选日期。`mode="single"` 选一天，`mode="range"` 配合 `v-model:range` 选起止日期。`numberOfMonths` 可以并排两个月。`focusDate` 决定先显示哪个月。`min`、`max` 和 `isDateDisabled` 用来限制哪些日期可选。

基本用法只需要绑定一个日期值：

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { ref } from 'vue'

const date = ref<Date | null>(new Date(2026, 9, 11))
</script>

<template>
  <Calendar v-model="date" label="选择日期" />
</template>
```

绑定值是原生 `Date`。通过 `min` 和 `max` 限制可选日期范围，通过 `isDateDisabled` 函数禁用特定日期。月份标题和星期名称跟随当前语言。组件自带文案默认是英文，调用 `provideAstryxLocale('zh-CN')` 后改为中文。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为业务场景设置合理的日期范围限制。 |
| <Badge variant="success">推荐</Badge> | 使用 `isDateDisabled` 禁用范围内仍不可选的日期。 |
| <Badge variant="success">推荐</Badge> | 用固定的本地日期构造 `Date`，避免把带时区的时间戳直接当成日历上的某一天。 |
| <Badge variant="error">避免</Badge> | 在日历上层叠过多的装饰或自定义内容，保持日期网格清晰。 |

## 示例

<DemoExample
  :demo="calendarConstraints"
  description="只能选择 2026 年 1 月 10 日到 3 月 20 日之间的工作日。"
  locale="zh"
  title="日期限制"
/>

<DemoExample
  :demo="calendarRange"
  description="选择开始和结束日期，中间的日子会高亮。"
  locale="zh"
  title="日期范围"
/>

<DemoExample
  :demo="calendarSingle"
  description="在月历里选择一天。"
  locale="zh"
  title="单日"
/>

<DemoExample
  :demo="calendarTwoMonths"
  description="并排显示两个月，用来选择跨月的日期范围。"
  locale="zh"
  title="两个月"
/>
