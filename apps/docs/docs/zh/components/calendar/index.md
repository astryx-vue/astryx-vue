---
layout: component-docs
title: 日历
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarConstraints, calendarRange, calendarSingle, calendarSpan, calendarTwoMonths, calendarWeeks } from '../../../../components/demos/calendar'
</script>

## 使用方法

`Calendar` 用月历网格选日期。可以选一天，也可以选一段起止日期，并排显示一个月或两个月。打开时先落到指定的月份；没有指定时，落在已选日期或今天，并尽量落进最早和最晚日期之间。

最早日期、最晚日期、返回真值的判断，以及一组返回假值的约束，都会让对应的日子不能选。范围还可以限制最短和最长天数，天数把两端都算进去。周数可以显示在每一行左侧。相邻月份的日期可以留在格子里，但不能选。行数可以按当月缩短，也可以固定六行。一周从哪一天开始，用数字或星期缩写指定。外面也可以拿到一个句柄，直接把月份翻到某一天并聚焦它。

方向键按天或按周移动，到头会翻月，并跳过不能选的日子。Home 和 End 移到这一周里能选的第一天和最后一天。PageUp 和 PageDown 翻一个月。Enter 或空格确认。范围还没选完时，Escape 取消。每个月是一块带月份名字的网格，今天、选中和禁用都能被读屏读到。

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


<ComponentAnatomy />

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

<DemoExample
  :demo="calendarWeeks"
  description="可以打开周数、月外日期、按月缩短行数，并把一周的第一天改成周一。"
  locale="zh"
  title="周数和周起始"
/>

<DemoExample
  :demo="calendarSpan"
  description="这段范围最长三天，周日不可选。六月按钮会把月份翻过去。"
  locale="zh"
  title="跨度与翻月"
/>
