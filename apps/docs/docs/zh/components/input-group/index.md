---
layout: component-docs
title: 输入框组
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic, inputGroupStatus, inputGroupWebsite } from '../../../../components/demos/input-group'
</script>

## 使用方法

`InputGroup` 将输入框与前缀、后缀、按钮等元素组合成一个整体，常用于需要添加说明标签、单位、操作按钮的场景。

基本用法通过 `before` 和 `after` 插槽添加前置或后置内容：

```vue
<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <InputGroup label="网站">
    <template #before>
      <InputGroupText>https://</InputGroupText>
    </template>
    <TextInput v-model="domain" label="网址" is-label-hidden placeholder="example" />
    <template #after>
      <InputGroupText>.com</InputGroupText>
    </template>
  </InputGroup>
</template>
```

写上标签之后，这一组就是一个字段：标签、说明、可选或必填、状态都由字段壳负责，不要在外面再包一层。组内输入框自己的标签继续说明这一格填什么，通常隐藏起来。前后缀里的固定文字用组内文本组件，它和前后缀共用同一套字号和颜色。没有标签时，组仍然只是一条连在一起的控件，方便嵌进已经有字段的表单。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用前置内容展示单位、协议前缀等固定文本。 |
| <Badge variant="success">推荐</Badge> | 用后置内容放置清除按钮、提交按钮等操作。 |
| <Badge variant="success">推荐</Badge> | 保持前后缀内容简洁，避免占用过多空间。 |
| <Badge variant="error">避免</Badge> | 同时使用过多前后缀元素，会让输入框显得拥挤。 |

## 示例

<DemoExample
  :demo="inputGroupBasic"
  description="金额输入两侧是固定的前缀和后缀，用来标明单位。"
  locale="zh"
  title="基本"
/>

<DemoExample
  :demo="inputGroupWebsite"
  description="协议和域名后缀固定在输入框两侧。"
  locale="zh"
  title="网站"
/>

<DemoExample
  :demo="inputGroupStatus"
  description="带上标签之后，说明、可选和错误都由这一组自己负责。"
  locale="zh"
  title="字段状态"
/>
