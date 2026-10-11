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

基本用法通过插槽添加前置或后置内容：

```vue
<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
</script>

<template>
  <InputGroup>
    <template #prepend>
      <span>https://</span>
    </template>
    <input type="text" placeholder="请输入域名" aria-label="域名输入">
    <template #append>
      <span>.com</span>
    </template>
  </InputGroup>
</template>
```

`prepend` 插槽用于添加前置内容，`append` 用于后置内容。可以是文字、图标、按钮等任何元素。

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
  description="使用前后缀插槽组合输入框与固定文本，适合 URL、邮箱等场景。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="inputGroupWithIcon"
  description="前缀插槽可以放置图标，增强视觉识别度。"
  locale="zh"
  title="带图标"
/>
