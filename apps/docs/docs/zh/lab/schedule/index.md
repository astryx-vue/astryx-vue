---
title: Schedule
---

# Schedule

Schedule 把一组事件画成月历、周或日的时间格，或者按天排成列表。翻页、今天和视图切换都由头部插件负责，当前页的时刻完全由调用方保存。它是展示组件，不是日期选择器。属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labSchedule } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSchedule" description="用右上角切换月、周、日、列表。Previous、Today、Next 会改 date。带时间的事件画在时间格里，分类决定颜色。" locale="zh" title="四种视图" /></ClientOnly>

## 导入

```ts
import {
  createEventFromISO,
  createScheduleDayView,
  createScheduleListView,
  createScheduleMonthlyView,
  createScheduleWeeklyView,
  Schedule,
  useSchedulePaginationPlugin,
  useScheduleViewSelectorPlugin,
} from '@astryx-vue/lab'
```

## 日期和事件

`date` 是必填的毫秒时刻，表示当前要看的那一页。翻页时组件调用 `onChangeDate`，模板里也可以听 `@change-date`。同一次操作只会通知一次。新时刻保留原来的时分，只平移到上一页或下一页。

`events` 可以是数组，也可以是 `(start, end) => Promise<事件[]>`。异步函数收到的是当前页的起止毫秒。请求还没回来时格子是空的，标题旁边有加载指示。

`createEventFromISO` 看到 `YYYY-MM-DD` 会做成全天事件，看到带时间的字符串会做成时刻事件。持续满 24 小时的时刻事件画在全天行。

`categories` 用 `label` 对齐 `event.category`，决定颜色和读屏里的分类名。对不上、或者事件没有分类时，分类名是 `Event`，颜色是蓝色。

## 视图

四种工厂都要保持同一个对象引用，不要在渲染时重新调用：

| 工厂 | 范围 |
| --- | --- |
| `createScheduleMonthlyView` | 含当月的整月格子，可设 `weekStartsOn` |
| `createScheduleWeeklyView` | 七天时间格，可设 `weekStartsOn`、`minHour`、`maxHour`、`hourHeight` |
| `createScheduleDayView` | 一天时间格，小时窗口同上 |
| `createScheduleListView` | 从 `date` 起连续若干天，默认 7 天，只列出有事件的天、今天和区间第一天 |

月、周、日可以传 `renderPopover`。返回内容时，对应事件是按钮，点开这一视图里唯一的浮层；返回 `null` 时该事件只读。不传时整页只读。列表视图没有这个浮层。

## 插件

不传 `plugins` 时只有分页：上一页、Today、下一页。传入数组会换掉这组默认按钮。`useScheduleViewSelectorPlugin` 放在末尾，按视图对象的引用判断当前选中项。

页眉上的区间标题固定是 2 级标题。`headingLevel` 只影响视图内部的小标题，默认 3。

按钮和浮层里的固定文案与上游一致，是英文，例如 Today、All day、Loading events。日期本身跟随当前 locale，并且按公历排。这里没有上游那套非公历历法。
