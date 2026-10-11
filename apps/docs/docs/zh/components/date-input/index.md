---
layout: component-docs
title: 日期输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputBasic, dateInputClearable } from '../../../../components/demos/date-input'
</script>

## 使用方法

`DateInput` 是一个日期输入组件，结合了文本输入框和日历弹出层。用户可以手动输入日期文本，也可以点击打开日历选择。

基本用法只需要绑定一个日期值：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateInput } from '@astryx-vue/core/DateInput'

const date = ref(null)
</script>

<template>
  <DateInput v-model="date" placeholder="选择日期" />
</template>
```

绑定值是原生 `Date`。输入框按 `YYYY-MM-DD` 显示日期，点击后通过弹出的日历选择。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为非必填的日期字段提供清除功能。 |
| <Badge variant="success">推荐</Badge> | 设置合理的日期范围限制，防止用户选择无效日期。 |
| <Badge variant="success">推荐</Badge> | 使用清晰的占位符提示日期格式。 |
| <Badge variant="error">避免</Badge> | 在需要精确到时分秒的场景使用日期输入框。 |

## 示例

<DemoExample
  :demo="dateInputBasic"
  description="点击输入框打开日历弹层，选择日期后自动关闭。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="dateInputClearable"
  description="开启 clearable 后，已选日期旁边会显示清除按钮。"
  locale="zh"
  title="可清除"
/>
