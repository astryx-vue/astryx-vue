---
layout: component-docs
title: 标签
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenClickable, tokenColors, tokenEnd, tokenIcon, tokenRemovable } from '../../../../components/demos/token'
</script>

## 使用方法

`Token` 是可交互的标签（chip），可移除、可点击、可作链接，用于已选值和筛选条件。`Badge` 是静态的状态或计数标记。

自动补全、多选器和标签输入框内部都会用到 `Token`，对话输入区也可以直接拿来表示附件或提及。

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


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用户可以拿掉这条信息时打开 `removable`，并在 `remove` 里更新自己的列表。 |
| <Badge variant="success">推荐</Badge> | 用 `#icon` 区分类型，不要把图标写进 `label`。 |
| <Badge variant="error">避免</Badge> | 用标签表达成功、警告这类状态。那种场景用 `Badge`。 |

## 示例

<DemoExample
  :demo="tokenClickable"
  description="点击后可以当作筛选，或打开详情。"
  locale="zh"
  title="可点击"
/>

<DemoExample
  :demo="tokenColors"
  description="11 种颜色，各有默认和禁用两种状态。"
  locale="zh"
  title="颜色"
/>

<DemoExample
  :demo="tokenEnd"
  description="文字后面可以放计数或状态。"
  locale="zh"
  title="尾部内容"
/>

<DemoExample
  :demo="tokenIcon"
  description="前面的图标用来区分类型。"
  locale="zh"
  title="图标"
/>

<DemoExample
  :demo="tokenRemovable"
  description="可以拿掉的筛选条件和收件人。"
  locale="zh"
  title="可移除"
/>
