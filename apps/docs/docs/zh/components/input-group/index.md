---
layout: component-docs
title: 输入框组
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic, inputGroupWithIcon } from '../../../../components/demos/input-group'
</script>

## 使用方法

`InputGroup` 将输入框与前缀、后缀、按钮等元素组合成一个整体，常用于需要添加说明标签、单位、操作按钮的场景。

基本用法通过 `before` 和 `after` 插槽添加前置或后置内容：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'

const domain = ref('')
</script>

<template>
  <InputGroup>
    <template #before>
      <span>https://</span>
    </template>
    <TextInput v-model="domain" label="域名" is-label-hidden placeholder="example" />
    <template #after>
      <span>.com</span>
    </template>
  </InputGroup>
</template>
```

`before` 放在输入框前面，`after` 放在后面。内容可以是文字、图标或按钮。

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
  description="用 before 和 after 插槽把固定文本和输入框合成一组，适合网址、邮箱这类带前后缀的字段。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="inputGroupWithIcon"
  description="before 插槽可以放一个简短前缀，用来提示字段含义。"
  locale="zh"
  title="带图标"
/>
