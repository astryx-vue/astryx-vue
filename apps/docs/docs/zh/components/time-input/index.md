---
layout: component-docs
title: 时间输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timeInputConstrained, timeInputFormats, timeInputIncrement, timeInputStates, timeInputSheet } from '../../../../components/demos/time-input'
</script>

## 使用方法

`TimeInput` 编辑一天里的时间。值是 ISO 时间，`HH:MM` 或 `HH:MM:SS`，没有选择时是 `null`。

```vue
<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time = shallowRef<string | null>('14:30')
</script>

<template>
  <TimeInput v-model="time" label="时间" />
</template>
```

默认按 12 小时显示。方向键按 `increment` 分钟步进。细指针下是文本框。`adaptive-native` 在粗指针上用系统时间控件；`adaptive-bottom-sheet` 在粗指针上用底部时分滚轮；`bottom-sheet` 不论指针都用滚轮。需要秒、步进不是 1 分钟，或设了预设间隔时，系统控件退回文本框，滚轮不受这个限制。占位符和清除文案跟随语言。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只有一段时间合法时，设置 `min` 和 `max`。 |
| <Badge variant="success">推荐</Badge> | 产品本身用 24 小时制时，设置 `hourFormat="24h"`。 |
| <Badge variant="error">避免</Badge> | 在这里收集日期。日期用 DateInput，日期加时间用 DateTimeInput。 |

## 示例

<DemoExample :demo="timeInputConstrained" description="晚餐只接受下午 5 点到晚上 10 点。" locale="zh" title="限制范围" />
<DemoExample :demo="timeInputFormats" description="24 小时制，以及保留秒的值。" locale="zh" title="格式" />
<DemoExample :demo="timeInputIncrement" description="方向键每次移动 15 分钟。" locale="zh" title="步进" />
<DemoExample :demo="timeInputStates" description="禁用、错误、警告和成功。" locale="zh" title="状态" />
<DemoExample :demo="timeInputSheet" description="不论指针类型，都用底部的小时和分钟滚轮。" locale="zh" title="底部面板" />
