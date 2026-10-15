---
layout: component-docs
title: 日期区间输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateRangeInputPresets, dateRangeInputValidation } from '../../../../components/demos/date-range-input'
</script>

## 使用方法

`DateRangeInput` 选择开始日期和结束日期。值是 `{ start, end }`，两端都是 ISO 日期；没有选择时是 `null`。

```vue
<script setup lang="ts">
import type { DateRange } from '@astryx-vue/core/DateRangeInput'
import { DateRangeInput } from '@astryx-vue/core/DateRangeInput'
import { shallowRef } from 'vue'

const range = shallowRef<DateRange | null>(null)
</script>

<template>
  <DateRangeInput v-model="range" label="日期区间" />
</template>
```

弹出层默认把两个月放在同一条标题下面。第一次点击记下起点，第二次点击在跨度合法时提交区间。再次点击起点时，最短天数是 1 就提交单日，否则取消这次选择。两端都在今年时，收起后的文字不写年份。预设按钮一直在日历旁边。两个月并排放不下时，月份会自动换成上下两行。约束函数可以再排除具体的日子。正在保存时字段不能改，保存会在区间写进去之后进行。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把人们最常选的区间做成预设。 |
| <Badge variant="success">推荐</Badge> | 单日或过长区间不合法时，设置 `minRangeSpan` 和 `maxRangeSpan`。天数包含两端。 |
| <Badge variant="error">避免</Badge> | 用它选单独一天。那是 DateInput 的事。 |

## 示例

<DemoExample :demo="dateRangeInputValidation" description="已填区间上的错误、警告和成功。" locale="zh" title="校验" />
<DemoExample :demo="dateRangeInputPresets" description="最近 7、14、30、90 天的预设，也可以自己选区间。" locale="zh" title="带预设" />
