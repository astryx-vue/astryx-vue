---
layout: component-docs
title: 对话
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatConversation } from '../../../../components/demos/chat'
</script>

## 使用方法

对话展示是一组可以叠成会话记录的部件：滚动布局、消息列表、不同发送者的消息行、气泡、工具调用、推理折叠、正在输入，以及未读分隔。消息正文走插槽。这套组件不渲染 Markdown，正文用纯文本，或者换成你自己的渲染器。

`ChatLayout` 是一列。记录区往上长，输入区贴在底部，下面有一层磨砂。默认由布局自己滚动。外面已经有滚动容器时传入 `scrollRef`，底部停靠会从 sticky 改成 fixed。

阅读位置在底部时，新文字会把视图继续贴在底部。一旦向上滚，贴底立刻停下，并出现回到底部的按钮。没贴底时又来了新消息，按钮文案会换成当前语言的「有新消息」，屏幕阅读器也会播报，`ChatUnreadDivider` 用来标出分界。`ChatLayout` 内部用 `useChatStreamScroll` 和 `useChatNewMessages` 串起这件事。`showScrollButton` 设为 `false` 可以拿掉内置按钮，也可以用 `scrollButton` 插槽换成自己的。

```vue
<script setup lang="ts">
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatLayout>
    <ChatMessageList>
      <ChatMessage sender="user">
        <ChatMessageBubble>帮我看一下发布说明。</ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble name="助手">说明在文档里。</ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <template #composer>
      <form><!-- 你的输入区 --></form>
    </template>
  </ChatLayout>
</template>
```

`ChatMessageList` 是 `role="log"`。助手回复还在增长时传入 `isStreaming`，屏幕阅读器会等这段结束再读一次。`scrollToTopAction` 在顶部哨兵进入滚动容器时执行，Promise 结束前顶部一直显示加载指示。

`ChatMessage` 是一条 `article`。`sender` 取 `user`、`assistant` 或 `system`。系统消息居中，头像、名字和元信息插槽都不会渲染。正文以气泡开头时，把可见名字放在 `ChatMessageBubble` 上，名字才能和气泡内边距对齐。

`ChatToolCalls` 接收一轮回复里已经有的工具调用。只有一条时就是一行。多条收在一个标题后面；展开时 `label` 会替换掉按数量生成的文案。某条带了 `detail`，或者提供了 `detail` 插槽，这一行自己还能再展开。分组用 `v-model:is-expanded` 控制。

`ChatReasoning` 是同样的折叠，用来放推理过程，默认收起。默认插槽如果是纯文本，会同时当作收起时的一行预览。`isStreaming` 会让标题闪动，并藏起预览和 `duration`。

`ChatTypingIndicator` 画三个点。传入 `names` 后，一个人、两个人、以及「某人和其他几人」各有一句文案，并会播报这句。`ChatUnreadDivider` 是那条「下面是新消息」的分隔线。

下面的示例把这些放在同一次会话里：文字逐字追加，工具调用和推理留在助手那一轮，有人正在输入，底部输入框可以再发一条。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 记录放进 `ChatMessageList`，输入放进 `composer` 插槽，磨砂和回到底部的按钮才对得齐。 |
| <Badge variant="success">推荐</Badge> | 助手正文还在增长时保持 `isStreaming`，写完再关掉。 |
| <Badge variant="success">推荐</Badge> | 把 `ChatUnreadDivider` 放在读者还没看到的第一条前面。按钮上的「有新消息」负责播报，分隔线负责标位置。 |
| <Badge variant="success">推荐</Badge> | 气泡里放纯文本、引文，或你自己的渲染结果。气泡只提供底色和圆角。 |
| <Badge variant="error">避免</Badge> | 在布局里面再套一个滚动容器。记录的滚动只交给布局自己，或者交给 `scrollRef` 指向的那个元素。 |
| <Badge variant="error">避免</Badge> | 每个流式 token 都自己播报一遍。正在输入和新消息文案已经走共用的 live region。 |

## 示例

<DemoExample
  :demo="chatConversation"
  description="一段会逐字追加的会话，里面有工具调用、可折叠的推理，以及正在输入。发送一行可以再接一轮。"
  locale="zh"
  title="模拟对话"
/>
