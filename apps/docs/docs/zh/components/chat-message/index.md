---
layout: component-docs
title: 对话消息
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageAvatar, chatMessageGhost, chatMessageMultiBubble } from '../../../../components/demos/chat-message'
</script>

## 使用方法

`ChatMessage` 是一条消息的外壳，负责按发送者角色摆好头像、名字、元信息和对齐方向。

`sender` 必填。它决定这条消息靠哪边，也决定头像、名字、元信息三个插槽要不要渲染：`system` 行居中显示，这三样都不出。密度默认跟着外层 `ChatMessageList` 走，单条消息也可以自己指定。

名字和元信息这两个插槽是给「正文不是气泡」的情况用的。正文第一条是 `ChatMessageBubble` 时，把名字放到气泡上，名字才会跟气泡的内边距对齐；元信息放在最后一条气泡上，道理一样。

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        Can you review the token validation changes?
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Looks good — ship it.
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatMessageAvatar" title="头像与名字" description="带头像和发送者名字的消息。正文用气泡时名字写在气泡上；正文是自由内容时名字写在消息外层。" locale="zh" />

<DemoExample :demo="chatMessageGhost" title="透明气泡" description="没有可见气泡边界的透明样式。内边距还留着，所以还能对齐，只是背景透明，适合助手的长回复。" locale="zh" />

<DemoExample :demo="chatMessageMultiBubble" title="多条气泡" description="用 group 属性收圆角，把同一个人的几条气泡连成一段。first、middle、last 依次写，就能看出是一口气说的。" locale="zh" />
