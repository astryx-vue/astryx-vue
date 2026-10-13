---
layout: component-docs
title: 表单布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { formLayoutHorizontal, formLayoutHorizontalLabels, formLayoutMixed, formLayoutNested } from '../../../../components/demos/form-layout'
</script>

## 使用方法

`FormLayout` 排列字段。它不是 `<form>`。字段放在默认插槽里，再选一个方向。

```vue
<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { TextInput } from '@astryx-vue/core/TextInput'
</script>

<template>
  <FormLayout>
    <TextInput v-model="name" label="姓名" />
    <TextInput v-model="email" label="邮箱" />
  </FormLayout>
</template>
```

`direction` 取 `vertical`（默认）、`horizontal` 或 `horizontal-labels`。纵向按间距刻度 4 往下排。横向把字段放进等宽的列。横向标签把标签放在左边、控件放在右边，窄于 480px 时改回纵向。

`defaultOptionality` 取 `optional` 或 `required`。它只影响没有自己写 `isOptional` 或 `isRequired` 的字段的标记和 `aria-required`，不写原生 `required`。同一字段两个都写时，选填优先。没有 `FormLayout` 祖先时，`aria-required` 仍是 `isRequired && !isOptional`。

嵌套的布局各自保留方向。纵向表单里可以放一行横向字段。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 一组短字段，例如名和姓，用横向。 |
| <Badge variant="success">推荐</Badge> | 每个字段都有标签、而且表单比手机宽时，用横向标签。 |
| <Badge variant="error">避免</Badge> | 把页面标题这类无关内容放进布局。它会参加网格排列。 |
| <Badge variant="error">避免</Badge> | 指望 `defaultOptionality` 拦住提交。它只改标记和 `aria-required`。 |

## 示例

<DemoExample
  :demo="formLayoutHorizontal"
  description="direction 为 horizontal 时，字段排成等宽的列。"
  locale="zh"
  title="横向"
/>

<DemoExample
  :demo="formLayoutHorizontalLabels"
  description="标签在左。窄于 480px 时改成上下排列。"
  locale="zh"
  title="横向标签"
/>

<DemoExample
  :demo="formLayoutMixed"
  description="默认纵向，依次是文本框、选择器和复选列表。"
  locale="zh"
  title="混合控件"
/>

<DemoExample
  :demo="formLayoutNested"
  description="纵向表单里放了两行横向字段。"
  locale="zh"
  title="嵌套"
/>
