---
layout: component-docs
title: useCalendarNavigation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarNavigationMonthPager } from '../../../../components/demos/use-calendar-navigation'
</script>

## 使用方法

管理日历当前显示哪个月：上一月、下一月、按语言和历法写的月份标题，以及键盘跨月时下一个要聚焦的日子，让方向键从这个月的最后一天顺着走进下个月。自己拼日历头、翻页按钮或双月选择器时直接用它，和 `useCalendarDays` 搭配。

可以不受控（`initialValue`），也可以受控（`focusDate` 加 `onFocusDateChange`）。传 `calendar` 时按那个历法的月翻页，`visibleCalendarMonths` 给出那个历法的年和月，可以直接交给同一历法的 `useCalendarDays`；日期仍是公历 ISO。它不读 provider 的历法。

```ts
import { useCalendarNavigation } from '@astryx-vue/core/Calendar'
```

```ts
const nav = useCalendarNavigation({ initialValue: '2026-01-15' })
const { weeks } = useCalendarDays(() => ({ ...nav.visibleCalendarMonths.value[0]! }))

nav.navigateMonth(1) // 下一月
nav.navigateMonth(1, focusedIso, 1) // 方向键跨月，翻过去后聚焦 nav.pendingFocus
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 `navigateMonth(-1)` 和 `navigateMonth(1)` 接到上一月、下一月按钮上。 |
| <Badge variant="success">推荐</Badge> | 方向键跨月时把 `focusedDate` 和 `offset`（左右键 1，上下键 7）传给 `navigateMonth`，翻过去后把焦点放到 `pendingFocus` 那天，再调 `clearPendingFocus`。 |
| <Badge variant="error">避免</Badge> | 手写月份标题；用 `monthYearLabel`，它跟着语言和历法写。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useCalendarNavigationMonthPager"
  description="用 useCalendarNavigation 加 useCalendarDays 拼一个月历：按钮翻月，在月末按右方向键会翻到下个月并聚焦第一天。"
  locale="zh"
  title="useCalendarNavigation — 月份翻页"
/>
