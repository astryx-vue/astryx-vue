---
layout: component-docs
title: 滚到底按钮
outline: false
footer: false
---

<script setup lang="ts">
import { chatLayoutScrollButtonLabels } from '../../../../components/demos/chat-layout-scroll-button'
</script>

## 使用方法

一颗浮在底部的「滚到底」按钮，用户离开最新消息往上翻的时候才出现。平时是一个小圆点图标，淡入淡出；有新消息时会长出文字。`ChatLayout` 默认就会画它：想换掉，往 `scrollButton` 插槽塞自己的控件；想彻底不要，把 `showScrollButton` 设成 `false`。

```ts
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
```

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatLayoutScrollButtonLabels"
  description="同一个按钮配不同文案，分别对应不同的提醒：有新消息、有几条未读回复，或者只是一句通用的「滚到底」。"
  locale="zh"
  title="ChatLayoutScrollButton — 文案"
/>
