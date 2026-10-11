---
layout: component-docs
title: 对话
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatBubbleCustom, chatBubbleDensity, chatBubbleGrouping, chatBubbleMetadata, chatBubbleVariants, chatLayoutPanel, chatListDensity, chatListFull, chatMessageAvatar, chatMessageGhost, chatMessageGroup, chatMetadataFooter, chatMetadataStatus, chatMetadataTime, chatScrollLabels, chatSystemIcon, chatSystemStatus, chatSystemVariants, chatToolsExpandable, chatToolsSimple, chatToolsStatuses } from '../../../../components/demos/chat'
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
      <form><!-- 你的输入区 --></form>
    </template>
  </ChatLayout>
</template>
```

`ChatMessageList` 是 `role="log"`。助手回复还在增长时传入 `isStreaming`，屏幕阅读器会等这段结束再读一次。`scrollToTopAction` 在顶部哨兵进入滚动容器时执行，Promise 结束前顶部一直显示加载指示。

`ChatMessage` 是一条 `article`。`sender` 取 `user`、`assistant` 或 `system`。系统消息居中，头像、名字和元信息插槽都不会渲染。正文以气泡开头时，把可见名字放在 `ChatMessageBubble` 上，名字才能和气泡内边距对齐。

`ChatToolCalls` 接收一轮回复里已经有的工具调用。只有一条时就是一行。多条收在一个标题后面；展开时 `label` 会替换掉按数量生成的文案。某条带了 `detail`，或者提供了 `detail` 插槽，这一行自己还能再展开。分组用 `v-model:is-expanded` 控制。

`ChatReasoning` 是同样的折叠，用来放推理过程，默认收起。默认插槽如果是纯文本，会同时当作收起时的一行预览。`isStreaming` 会让标题闪动，并藏起预览和 `duration`。

`ChatTypingIndicator` 画三个点。传入 `names` 后，一个人、两个人、以及「某人和其他几人」各有一句文案。根节点是 `role="status"`，由它播报这一句。`ChatUnreadDivider` 标出第一条未读消息，新到的内容放在它下面。

下面的示例和 Astryx 文档站里 Chat 分类的示例一一对应，顺序也按那边的组件页来：布局、回到底部、消息、气泡、列表、元信息、系统消息、工具调用。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 记录放进 `ChatMessageList`，输入放进 `composer` 插槽，磨砂和回到底部的按钮才对得齐。 |
| <Badge variant="success">推荐</Badge> | 助手正文还在增长时保持 `isStreaming`，写完再关掉。 |
| <Badge variant="success">推荐</Badge> | 把 `ChatUnreadDivider` 放在读者还没看到的第一条前面。按钮上的「有新消息」负责播报，分隔线负责标位置。 |
| <Badge variant="success">推荐</Badge> | 气泡里放纯文本、引文，或你自己的渲染结果。气泡只提供底色和圆角。 |
| <Badge variant="error">避免</Badge> | 在布局里面再套一个滚动容器。记录的滚动只交给布局自己，或者交给 `scrollRef` 指向的那个元素。 |
| <Badge variant="error">避免</Badge> | 每个流式 token 都自己播报一遍。正在输入靠自己的 `role="status"` 播报一次，新消息文案走布局里的 live region。 |

## 示例

<DemoExample
  :demo="chatLayoutPanel"
  description="窄栏里的会话。容器一窄就会用上紧凑密度，适合侧栏、抽屉，或嵌在页面里的对话。"
  locale="zh"
  title="ChatLayout — 面板"
/>

<DemoExample
  :demo="chatScrollLabels"
  description="回到底部的按钮可以只显示图标，也可以带上新消息、未读回复这类说明。"
  locale="zh"
  title="ChatLayoutScrollButton — 文案"
/>

<DemoExample
  :demo="chatMessageAvatar"
  description="带头像和发送者名字。正文以气泡开头时，名字放在气泡上；没有气泡时，名字放在消息上。"
  locale="zh"
  title="ChatMessage — 头像与名字"
/>

<DemoExample
  :demo="chatMessageGhost"
  description="透明气泡没有可见边界，仍保留内边距以便对齐。适合助手的长回复。"
  locale="zh"
  title="ChatMessage — 透明气泡"
/>

<DemoExample
  :demo="chatMessageGroup"
  description="用 group 收紧同一侧的圆角，把同一人连续发出的几条气泡连在一起。"
  locale="zh"
  title="ChatMessage — 多气泡"
/>

<DemoExample
  :demo="chatBubbleCustom"
  description="气泡里可以放对齐到文字列的自定义内容。透明气泡拉满消息列，时间贴在气泡的元信息上。"
  locale="zh"
  title="ChatMessageBubble — 自定义内容"
/>

<DemoExample
  :demo="chatBubbleDensity"
  description="紧凑、均衡、宽松并排。密度决定气泡内边距、圆角，以及成组气泡之间的间距。"
  locale="zh"
  title="ChatMessageBubble — 密度"
/>

<DemoExample
  :demo="chatBubbleGrouping"
  description="一条消息里用 first、middle、last 收紧发送者那一侧的圆角。"
  locale="zh"
  title="ChatMessageBubble — 分组"
/>

<DemoExample
  :demo="chatBubbleMetadata"
  description="名字和元信息都对齐气泡的内边距。名字放在第一条气泡上，元信息放在最后一条上。"
  locale="zh"
  title="ChatMessageBubble — 元信息"
/>

<DemoExample
  :demo="chatBubbleVariants"
  description="实心和透明两种气泡，用户和助手都会用到。实心是普通消息，透明用来对齐、但不画边界。"
  locale="zh"
  title="ChatMessageBubble — 变体"
/>

<DemoExample
  :demo="chatListDensity"
  description="三种密度并排。侧栏用紧凑，整页对话多用均衡，长文用宽松。行距要和密度分开时，用 gap。"
  locale="zh"
  title="ChatMessageList — 密度"
/>

<DemoExample
  :demo="chatListFull"
  description="一次会话里放上日期分隔、文件名、代码、透明气泡和元信息。"
  locale="zh"
  title="ChatMessageList — 完整会话"
/>

<DemoExample
  :demo="chatMetadataFooter"
  description="助手回复下面的操作：复制、重试、有用、没用，以及模型名。"
  locale="zh"
  title="ChatMessageMetadata — 底部操作"
/>

<DemoExample
  :demo="chatMetadataStatus"
  description="五种送达状态：发送中、已发送、已送达、已读、失败。每条都带时间。"
  locale="zh"
  title="ChatMessageMetadata — 状态"
/>

<DemoExample
  :demo="chatMetadataTime"
  description="只有时间的元信息。可以是钟点，也可以是相对时间。"
  locale="zh"
  title="ChatMessageMetadata — 时间"
/>

<DemoExample
  :demo="chatSystemIcon"
  description="系统消息前面放一个图标，用来区分加入、加密、生成和核验。"
  locale="zh"
  title="ChatSystemMessage — 图标"
/>

<DemoExample
  :demo="chatSystemStatus"
  description="会话里的状态流水：谁加入、话题改了、谁离开、日期，以及已解决。"
  locale="zh"
  title="ChatSystemMessage — 状态更新"
/>

<DemoExample
  :demo="chatSystemVariants"
  description="默认和分隔线并排。默认用来写一行状态，分隔线用来标日期或分段。"
  locale="zh"
  title="ChatSystemMessage — 变体"
/>

<DemoExample
  :demo="chatToolsExpandable"
  description="工具调用可以展开结果，比如差异和命令输出。点一行就能打开。"
  locale="zh"
  title="ChatToolCalls — 可展开"
/>

<DemoExample
  :demo="chatToolsSimple"
  description="上面是单条调用，下面是可折叠的一组，并带上增删行数。"
  locale="zh"
  title="ChatToolCalls — 简单"
/>

<DemoExample
  :demo="chatToolsStatuses"
  description="等待、运行、完成、失败四种状态放在同一组里。"
  locale="zh"
  title="ChatToolCalls — 各种状态"
/>
