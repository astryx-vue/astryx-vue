---
layout: component-docs
title: 日期输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputClearable, dateInputRange, dateInputFormats, dateInputDescription, dateInputValidation } from '../../../../components/demos/date-input'
</script>

## 使用方法

`DateInput` 是一个日期输入组件，结合了文本输入框和日历弹出层。用户可以手动输入日期文本，也可以点击打开日历选择。

基本用法只需要绑定一个日期值：

```vue
<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref(null)
</script>

<template>
  <DateInput v-model="date" placeholder="选择日期" />
</template>
```

绑定值是原生 `Date`。默认按长日期显示，例如 March 21, 2026。`format` 可以是 `date`、`date_long`、`date_weekday`、`system_date`，或一个接收 `YYYY-MM-DD` 的函数。`description` 显示在标签下方。`status` 传 `{ type, message }` 时，说明会出现在字段下面。`presentation="bottom-sheet"` 在底部面板里打开日历，`adaptive-bottom-sheet` 则在粗指针设备上这样做。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为非必填的日期字段提供清除功能。 |
| <Badge variant="success">推荐</Badge> | 设置合理的日期范围限制，防止用户选择无效日期。 |
| <Badge variant="success">推荐</Badge> | 使用清晰的占位符提示日期格式。 |
| <Badge variant="error">避免</Badge> | 在需要精确到时分秒的场景使用日期输入框。 |

## 示例

<DemoExample
  :demo="dateInputClearable"
  description="可选的活动日期，带清除按钮。字段上方显示当前选中的值。"
  locale="zh"
  title="可清除"
/>

<DemoExample
  :demo="dateInputDescription"
  description="标签下方的说明用来交代这个日期的用途。"
  locale="zh"
  title="说明文字"
/>

<DemoExample
  :demo="dateInputFormats"
  description="同一天可以显示为短月份、长月份、带星期、ISO 日期，或自定义文案。"
  locale="zh"
  title="显示格式"
/>

<DemoExample
  :demo="dateInputRange"
  description="只能选择本月 8 日到 21 日。粗指针设备会在底部面板里打开日历。"
  locale="zh"
  title="最小和最大"
/>

<DemoExample
  :demo="dateInputValidation"
  description="错误、警告和成功，各自带一条说明。"
  locale="zh"
  title="校验状态"
/>
