---
layout: component-docs
title: 日期时间输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateTimeInputValidation } from '../../../../components/demos/date-time-input'
</script>

## 使用方法

`DateTimeInput` 把日期和时间放在一起。值是 `YYYY-MM-DDTHH:MM`。两部分都有了才会写出这个值，否则是 `null`。

```vue
<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { shallowRef } from 'vue'

const meeting = shallowRef<string | null>(null)
</script>

<template>
  <DateTimeInput v-model="meeting" label="会议时间" has-clear />
</template>
```

日期用日期输入框，时间用和时间输入框相同的字段。两个字段默认左右并排，并随行宽一起变窄。行宽小于 16rem 时才换行。清除会同时清掉日期和时间。日期那一半可以一次显示两个月，并指定一周从哪一天开始。正在保存时两个字段都不能改。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 时间可选时打开 `hasClear`。 |
| <Badge variant="error">避免</Badge> | 只需要日期时使用它。DateInput 更合适。 |

## 示例

<DemoExample :demo="dateTimeInputValidation" description="已填好的日期时间上的错误、警告和成功。" locale="zh" title="校验" />
