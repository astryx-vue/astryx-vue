---
layout: component-docs
title: 对话消息气泡
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageBubbleCustomContent, chatMessageBubbleDensity, chatMessageBubbleGrouping, chatMessageBubbleMetadata, chatMessageBubbleVariants } from '../../../../components/demos/chat-message-bubble'
</script>

## 使用方法

`ChatMessageBubble` 是消息里那块带底色和圆角的内容框。它不给发送者属性，而是从外层 `ChatMessage` 自己读出来，于是底色、圆角、对齐都会跟着走。不在 `ChatMessage` 里时，按助手那一侧显示。

`variant` 选外观：`filled` 是常规的实心气泡；`ghost` 只保留内边距、去掉底色，正文没有可见边界但仍能对齐。名字和元信息各有插槽，左右内边距跟气泡正文一致。同一个人的连续几条用 `group` 写着 first / middle / last，靠发送者那一侧的圆角会收小，看起来是一整段。

气泡里只有一个代码块，或者只有带 `astryx-chat-card` 类的元素时，气泡会自己去掉内边距和底色，让卡片跟气泡边缘齐平。

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessage sender="user">
    <ChatMessageBubble>
      Can you review the token validation changes?
    </ChatMessageBubble>
  </ChatMessage>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatMessageBubbleCustomContent" title="自定义内容" description="消息里放自定义内容，并且跟气泡的文字列对齐。示例把一个卡片包在 width=&quot;100%&quot; 的透明气泡里，左边缘就贴着气泡文字，宽度铺满整列而不是被默认的气泡宽上限卡住；时间放在气泡的元信息插槽里。" locale="zh" />

<DemoExample :demo="chatMessageBubbleDensity" title="疏密" description="紧凑、平衡、宽松三种疏密并排看。疏密会影响气泡内边距、圆角，以及同一组气泡之间的间距。" locale="zh" />

<DemoExample :demo="chatMessageBubbleGrouping" title="分组" description="多条气泡用 first、middle、last 标位置。靠发送者那一侧的圆角会收小，看着是一口气说完的一段。" locale="zh" />

<DemoExample :demo="chatMessageBubbleMetadata" title="元信息" description="名字和元信息插槽，位置跟气泡内边距对齐。一条消息里，名字放第一条气泡，元信息放最后一条气泡。" locale="zh" />

<DemoExample :demo="chatMessageBubbleVariants" title="变体" description="实心和透明两种气泡，用户和助手两侧都能用。常规消息用实心；不想看到边界、又要对齐时用透明。" locale="zh" />
