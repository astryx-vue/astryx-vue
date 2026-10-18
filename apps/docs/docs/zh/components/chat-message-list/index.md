---
layout: component-docs
title: 对话消息列表
outline: false
footer: false
---

<script setup lang="ts">
import { chatMessageListDensity, chatMessageListFullFeatured } from '../../../../components/demos/chat-message-list'
</script>

## 使用方法

`ChatMessageList` 是装消息的容器，只负责排版：它把疏密传给里面的消息，也支持滚到顶部加载更早的消息。它自带 `role="log"` 和 `aria-live="polite"`，读屏能把它当消息记录来读。消息不多、填不满时，底下有一块弹性占位把消息顶到底部。

消息放进默认插槽，一般是 `ChatMessage` 和 `ChatSystemMessage`。`density` 会传给没有自己指定疏密的那些消息。`gap` 只改行与行之间的距离，不动内边距——大模型事件流那种行距不均匀的场景用得上。

`scrollToTopAction` 配一个顶部哨兵：哨兵一进入滚动容器就调用它，返回的 Promise 没结束前顶部一直显示加载中。它要跟一个真正会滚动的祖先配合；放在 `ChatLayout` 里时，滚动交给布局。

`isStreaming` 会把整个日志标成 `aria-busy`，读屏就会等助手写完再播报一次，而不是每来一个 token 就重念半句话。

```vue
<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatMessageList :is-streaming="true">
    <ChatMessage sender="user">
      <ChatMessageBubble>How should I structure a monorepo?</ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Use workspaces with a shared packages directory.
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatMessageListDensity" title="疏密" description="紧凑、平衡、宽松三种疏密并排看。侧栏和面板用紧凑，整页对话用平衡，长文阅读用宽松。行距想跟疏密分开调，就用 gap。" locale="zh" />

<DemoExample :demo="chatMessageListFullFeatured" title="完整示例" description="一段完整的对话，里面有系统消息、多条气泡、加粗文字、代码块和元信息。日期分隔、透明气泡、分组消息、富内容都用上了。" locale="zh" />
