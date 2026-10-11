---
layout: component-docs
title: 词元
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenBasic, tokenColors } from '../../../../components/demos/token'
</script>

## 使用方法

`Token` 是一枚可复用的小标签。自动补全、多选器和标签输入内部都会用到它，对话输入区也可以直接拿来表示附件或提及。

`removable` 会显示一个可聚焦的删除按钮。点击、`Backspace` 和 `Delete` 都会发出 `remove`。`disabled` 时删除按钮不再响应。`#icon` 放在文字前面，适合类型图标。

有 `href` 时渲染成链接。删除按钮和链接同时存在时，两者是兄弟节点，按钮不会套在链接里面。

```vue
<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <Token label="设计评审" color="blue" removable>
    <template #icon>
      <span aria-hidden="true">#</span>
    </template>
  </Token>
</template>
```

删除按钮的无障碍名称默认是英文 `Remove 设计评审`。调用 `provideAstryxLocale('zh-CN')` 后改为「移除设计评审」。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用户可以拿掉这条信息时打开 `removable`，并在 `remove` 里更新自己的列表。 |
| <Badge variant="success">推荐</Badge> | 用 `#icon` 区分类型，不要把图标写进 `label`。 |
| <Badge variant="error">避免</Badge> | 用词元表达成功、警告这类状态。那种场景用 `Badge`。 |

## 示例

<DemoExample
  :demo="tokenBasic"
  description="可删除的词元带前缀图标。禁用后删除按钮不再响应。"
  locale="zh"
  title="可删除"
/>

<DemoExample
  :demo="tokenColors"
  description="颜色和 Badge 使用同一套色板。"
  locale="zh"
  title="颜色"
/>
