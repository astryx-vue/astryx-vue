---
layout: component-docs
title: 日历
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`Calendar` 是一个日期选择日历组件，以网格形式展示一个月的日期，用户可以点击选择日期。支持键盘导航、日期范围限制、禁用日期等功能。

基本用法只需要绑定一个日期值：

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { today } from '@internationalized/date'
import { ref } from 'vue'

const date = ref(today('Asia/Shanghai'))
</script>

<template>
  <Calendar v-model="date" />
</template>
```

日期值使用 `@internationalized/date` 库的 `CalendarDate` 类型，这是一个不含时区的纯日期表示，避免了原生 `Date` 对象的时区问题。

通过 `minValue` 和 `maxValue` 限制可选日期范围：

```vue
<script setup lang="ts">
import { today } from '@internationalized/date'

const minDate = today('Asia/Shanghai')
const maxDate = today('Asia/Shanghai').add({ months: 1 })
</script>

<template>
  <Calendar v-model="date" :min-value="minDate" :max-value="maxDate" />
</template>
```

通过 `isDateUnavailable` 函数禁用特定日期，如周末或节假日：

```vue
<script setup lang="ts">
function isWeekend(date) {
  const day = date.toDate('Asia/Shanghai').getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <Calendar v-model="date" :is-date-unavailable="isWeekend" />
</template>
```

日历支持完整的键盘导航：方向键移动焦点日期，`PageUp`/`PageDown` 翻月，`Home`/`End` 跳到月初月末，`Enter` 或 `Space` 选中当前日期。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为业务场景设置合理的日期范围限制。 |
| <Badge variant="success">推荐</Badge> | 使用 `isDateUnavailable` 禁用不可选的日期。 |
| <Badge variant="success">推荐</Badge> | 使用 `@internationalized/date` 而不是原生 `Date`，避免时区问题。 |
| <Badge variant="error">避免</Badge> | 在日历上层叠过多的装饰或自定义内容，保持日期网格清晰。 |

## 示例

日历组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CalendarDate \| null` | `null` | 选中的日期 |
| `defaultValue` | `CalendarDate` | - | 默认展示的月份 |
| `minValue` | `CalendarDate` | - | 最小可选日期 |
| `maxValue` | `CalendarDate` | - | 最大可选日期 |
| `isDateUnavailable` | `(date: CalendarDate) => boolean` | - | 判断日期是否不可选 |
| `locale` | `string` | `'zh-CN'` | 地区代码 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readonly` | `boolean` | `false` | 是否只读 |

## Emits

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `date: CalendarDate \| null` | 日期变化时触发 |
| `change` | `date: CalendarDate \| null` | 日期变化时触发 |

## Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `header` | `{ month: string, year: number }` | 自定义头部 |
| `day` | `{ date: CalendarDate, isSelected: boolean, isDisabled: boolean }` | 自定义日期单元格 |

## 键盘交互

| 按键 | 功能 |
| --- | --- |
| `ArrowLeft` | 焦点移到前一天 |
| `ArrowRight` | 焦点移到后一天 |
| `ArrowUp` | 焦点移到上一周的同一天 |
| `ArrowDown` | 焦点移到下一周的同一天 |
| `PageUp` | 上一个月 |
| `PageDown` | 下一个月 |
| `Home` | 焦点移到当月第一天 |
| `End` | 焦点移到当月最后一天 |
| `Enter` / `Space` | 选中焦点日期 |

## 无障碍

- 使用 `role="grid"` 日历网格语义
- 周标题使用 `<th>` 和 `scope="col"`
- 日期单元格包含 `aria-selected` 状态
- 不可选日期标记 `aria-disabled="true"`
- 完整的键盘导航支持，符合 ARIA Authoring Practices
