---
layout: component-docs
title: 输入框组
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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

组件内部可以放置 `<input>`、`<textarea>` 或其他输入组件，`InputGroup` 会为它们提供统一的视觉容器和边框。

```vue
<template>
  <InputGroup>
    <template #prepend>
      <span class="i-lucide-user" />
    </template>
    <input type="text" placeholder="用户名" aria-label="用户名输入">
  </InputGroup>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用前置内容展示单位、协议前缀等固定文本。 |
| <Badge variant="success">推荐</Badge> | 用后置内容放置清除按钮、提交按钮等操作。 |
| <Badge variant="success">推荐</Badge> | 保持前后缀内容简洁，避免占用过多空间。 |
| <Badge variant="error">避免</Badge> | 同时使用过多前后缀元素，会让输入框显得拥挤。 |
| <Badge variant="error">避免</Badge> | 在前后缀中放置过长的文本或复杂的交互元素。 |

## 示例

输入框组组件示例将在应用中正常显示。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | 状态 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 输入框主体内容 |
| `prepend` | 前置内容 |
| `append` | 后置内容 |

## 无障碍

- 保持内部输入元素的原生语义
- 前后缀装饰性元素使用 `aria-hidden="true"`
- 前后缀交互元素（按钮等）保留完整的无障碍属性
