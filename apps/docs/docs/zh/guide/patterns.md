---
title: 应用模式
---

# 应用模式

组件按原版的粒度拆开，同一类界面可以叠在一起用。目前成套提供的是对话这一种：消息列表、气泡、引用和 Markdown 各自是组件，由应用决定怎么拼。

`Chat` 从 `@astryx-vue/core/Chat` 引入。`ChatLayout` 是一列，记录放进 `ChatMessageList`，输入区放进 `composer` 插槽。布局默认自己滚动。阅读位置在底部时，新内容会继续贴底；向上滚之后贴底停止，并出现回到底部的按钮。这件事内部用 `useChatStreamScroll` 和 `useChatNewMessages`。

```vue
<script setup lang="ts">
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatLayout>
    <ChatMessageList>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          帮我看一下发布说明。
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble name="助手">
          说明在文档里。
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <form><!-- 输入区由应用提供 --></form>
    </template>
  </ChatLayout>
</template>
```

这套组件不连接模型，也不渲染 Markdown。正文是插槽。要排版回复，用 `@astryx-vue/core/Markdown` 的 `Markdown`。要标来源，用 `@astryx-vue/core/Citation` 的 `Citation`。工具调用、推理过程和正在输入分别是 `ChatToolCalls`、`ChatReasoning` 和 `ChatTypingIndicator`，都从 `Chat` 入口导出。

`sender` 取 `user`、`assistant` 或 `system`。系统消息用 `ChatSystemMessage`，居中，不渲染头像和名字。

更完整的示例、密度和未读分隔在 [对话](/components/chat)。引用和 Markdown 各有自己的组件页。原版文档里的其他页面模板，这个仓库还没有对应的整页预设。
