---
layout: component-docs
title: 对话系统消息
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatSystemMessageIcon, chatSystemMessageStatusUpdates, chatSystemMessageVariants } from '../../../../components/demos/chat-system-message'
</script>

## 使用方法

`ChatSystemMessage` 用在对话里放「不是某个人说的话」那一类内容：谁进群了、谁退群了、话题换了、今天几号。要陈述事实就用 `default`，要分隔日期或段落就用 `divider`。`default` 的长文本会在可用宽度里换行。整行带状态语义，`divider` 那一支还带一条有文字标签的分隔线。

这一行是 `role="status"`，所以内容变了读屏会播报，但焦点不动。文字放在默认插槽里，必填。`icon` 插槽的内容在 `default` 里排在文字前面；`divider` 渲染的是一条带标签的 `Divider`，不看图标。

```vue
<script setup lang="ts">
import { ChatSystemMessage } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>
  <ChatSystemMessage variant="divider">
    March 15, 2026
  </ChatSystemMessage>
</template>
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 文字写短、写全，没有图标也能看懂。 |
| <Badge variant="success">推荐</Badge> | 日期、段落分界用 `divider`；陈述状态用 `default`。 |
| <Badge variant="error">避免</Badge> | 拿它代替某个人说的话。那种内容用 `ChatMessage` 和 `ChatMessageBubble`。 |
| <Badge variant="error">避免</Badge> | 只靠图标传达意思。文字本身要把同样的信息说清楚。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatSystemMessageIcon" title="图标" description="每条系统消息前面带一个图标，帮忙说明这是哪一类。扫一眼就能认出是进群、加密还是校验通过。" locale="zh" />

<DemoExample :demo="chatSystemMessageStatusUpdates" title="状态更新" description="一段对话里真实的系统消息：成员进出、日期分界，还有解决提示。" locale="zh" />

<DemoExample :demo="chatSystemMessageVariants" title="变体" description="default 和 divider 两种变体并排看。行内的状态提示用 default，日期分隔或分段用 divider。" locale="zh" />
