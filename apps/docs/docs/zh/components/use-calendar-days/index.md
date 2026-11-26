---
layout: component-docs
title: useCalendarDays
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarDaysMonthGrid } from '../../../../components/demos/use-calendar-days'
</script>

## 使用方法

排出一个月的日子格子：这个月的每一天，加上补齐首尾两周的前后月日子，按周分好，再给一行按语言写的星期名，从 `weekStartsOn` 开始。和 `Calendar` 用的是同一套排法，适合自己拼一个紧凑的空闲日历或迷你月历。它只返回数据：渲染、选择、键盘导航和格子的无障碍语义都由调用方负责。

传 `calendar` 时按那个历法排月份，例如 `{ year: 1405, month: 8, calendar: 'persian' }` 是波斯历阿班月；每一天的 `date` 和 `iso` 仍是公历。它不读 provider 的历法，要跟随时自己把 `useLocale().calendar` 传进来。

```ts
import { useCalendarDays } from '@astryx-vue/core/Calendar'
```

```ts
const { weeks, dayNames } = useCalendarDays({ year: 2026, month: 12, weekStartsOn: 1 })

// 选项会变时传取值函数
const { weeks: persianWeeks } = useCalendarDays(() => ({ year: year.value, month: month.value, calendar: 'persian' }))
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 `dayNames` 渲染成表头，表头和格子一起跟着 `weekStartsOn` 和语言变。 |
| <Badge variant="success">推荐</Badge> | `isOutside` 的日子换个样式（比如变淡），让人看出它们属于前后月。 |
| <Badge variant="error">避免</Badge> | 拿它做让人选日期的控件；那种场景用 `Calendar`，它自带选择、键盘导航和格子语义。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useCalendarDaysMonthGrid"
  description="用 useCalendarDays 排出 2026 年 12 月：表头和格子都从所选的周起始日开始，前后月补齐的日子变淡。"
  locale="zh"
  title="useCalendarDays — 月格子"
/>
