---
layout: component-docs
title: useCalendarConstraints
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarConstraintsHotelBooking } from '../../../../components/demos/use-calendar-constraints'
</script>

## 使用方法

判断日期能不能选：把 `min` / `max` 边界、从正在选的范围起点量的跨度，以及自定义规则（每周的休息日、封锁日）合成一个 `isDateDisabled`。`Calendar` 内部用的就是这套规则；自己做排期界面或范围选择器时直接用它。

`isDateDisabled` 每次调用都读最新的选项，所以在模板里调用会跟着选项更新。日期都是公历 `PlainDate`，和 `useCalendarDays` 给出的 `day.date` 一样，在任何历法下都通用。

```ts
import { useCalendarConstraints } from '@astryx-vue/core/Calendar'
```

```ts
const anchor = ref<PlainDate | null>(null)
const { isDateDisabled } = useCalendarConstraints(() => ({
  min: '2026-06-05',
  max: '2026-06-25',
  maxRangeSpan: 8,
  rangeAnchor: anchor.value,
  dateConstraints: [date => date.getDay() !== 1],
}))

isDateDisabled({ year: 2026, month: 6, day: 15 })
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用户点了第一个日期之后再传 `rangeAnchor`，这样点第一下之前所有能做起点的日子都可选。 |
| <Badge variant="success">推荐</Badge> | 每周的休息日、过去的节假日、已售完的日期这类会变的规则放进 `dateConstraints`。 |
| <Badge variant="error">避免</Badge> | 在 `dateConstraints` 里发网络请求或做重计算；格子里每画一天都会同步调用一次 `isDateDisabled`。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useCalendarConstraintsHotelBooking"
  description="用 useCalendarConstraints 加 useCalendarDays 做一个酒店预订月历：营业季之外和周一不能选；选了入住日后，超过 7 晚的日子也变成不可选。"
  locale="zh"
  title="useCalendarConstraints — 酒店预订"
/>
