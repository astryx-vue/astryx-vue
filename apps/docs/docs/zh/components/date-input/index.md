---
layout: component-docs
title: 日期输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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

日期值使用 `@internationalized/date` 库的 `CalendarDate` 类型。组件会自动格式化日期为 `YYYY-MM-DD` 格式显示。

通过 `format` 属性自定义日期显示格式：

```vue
<template>
  <DateInput v-model="date" format="YYYY年MM月DD日" />
</template>
```

通过 `minValue` 和 `maxValue` 限制可选日期范围，超出范围的日期在日历中会被禁用：

```vue
<script setup lang="ts">
import { today } from '@internationalized/date'

const minDate = today('Asia/Shanghai')
const maxDate = today('Asia/Shanghai').add({ years: 1 })
</script>

<template>
  <DateInput v-model="date" :min-value="minDate" :max-value="maxDate" />
</template>
```

开启 `clearable` 属性后，已选中的日期旁边会显示清除按钮：

```vue
<template>
  <DateInput v-model="date" clearable />
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 为非必填的日期字段提供清除功能。 |
| <Badge variant="success">推荐</Badge> | 设置合理的日期范围限制，防止用户选择无效日期。 |
| <Badge variant="success">推荐</Badge> | 使用清晰的占位符提示日期格式。 |
| <Badge variant="error">避免</Badge> | 在需要精确到时分秒的场景使用日期输入框，应使用日期时间选择器。 |

## 示例

日期输入框组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CalendarDate \| null` | `null` | 选中的日期 |
| `format` | `string` | `'YYYY-MM-DD'` | 日期显示格式 |
| `placeholder` | `string` | `'请选择日期'` | 占位符文本 |
| `clearable` | `boolean` | `false` | 是否可清除 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `minValue` | `CalendarDate` | - | 最小可选日期 |
| `maxValue` | `CalendarDate` | - | 最大可选日期 |
| `isDateUnavailable` | `(date: CalendarDate) => boolean` | - | 判断日期是否不可选 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | 状态 |

## Emits

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `date: CalendarDate \| null` | 日期变化时触发 |
| `change` | `date: CalendarDate \| null` | 日期变化时触发 |
| `clear` | - | 清除日期时触发 |

## Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `prepend` | - | 输入框前置内容 |
| `append` | - | 输入框后置内容 |

## 键盘交互

| 按键 | 功能 |
| --- | --- |
| `Enter` / `Space` | 打开日历弹层 |
| `Escape` | 关闭日历弹层 |
| `ArrowDown` | 打开日历弹层并移动焦点到日历 |
| 日历打开时 | 所有日历键盘交互适用 |

## 无障碍

- 输入框包含 `role="combobox"` 和 `aria-haspopup="dialog"`
- 日历弹层使用 `role="dialog"` 和合适的 `aria-label`
- 支持 `aria-expanded` 状态
- 完整的键盘导航支持
