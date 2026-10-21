---
layout: component-docs
title: 对话
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatBubbleCustom, chatBubbleDensity, chatBubbleGrouping, chatBubbleMetadata, chatBubbleVariants, chatComposerMentions, chatComposerShell, chatComposerStates, chatLayoutPanel, chatListDensity, chatListFull, chatMessageAvatar, chatMessageGhost, chatMessageGroup, chatMetadataFooter, chatMetadataStatus, chatMetadataTime, chatScrollLabels, chatSystemIcon, chatSystemStatus, chatSystemVariants, chatTokenized, chatToolsExpandable, chatToolsSimple, chatToolsStatuses } from '../../../../components/demos/chat'
</script>

## 使用方法

`Chat` 这一套组件，就像积木一样，包含搭建完整聊天窗口所需的各个部件：滚动的对话外框、消息列表、区分发送者的消息行、聊天气泡、AI 工具调用折叠栏、思考过程折叠、正在输入动画，以及未读消息提示线。消息正文通过插槽传入。组件本身不带 Markdown 解析器，你可以直接放纯文本，也可以接上你自己喜欢的 Markdown 渲染库。

**什么时候用：**
- 搭建大模型 AI 对话界面、客服客服聊天窗口或即时聊天应用时。

**什么时候不要用：**
- 如果只是为了让用户留个言、发一条评论，用普通的表单评论区组件更轻快。
- 如果只是通知中心的一串流水消息，用时间线列表或通知流即可。

各个积木的组装分工如下：

- `ChatLayout` 是最外层的纵向布局容器。消息记录区在上方自适应伸展，输入框贴在底部，底部还带有一层毛玻璃磨砂效果。默认由布局自己滚动；如果外层已经有滚动容器，可以传入 `scrollRef`，底部停靠会自动调整为跟随固定的模式。
- 当用户浏览到最底部时，新生成的内容会自动把滚动条继续贴在底部。如果用户往上翻看历史记录，自动贴底会立刻暂停，并浮现一个回到最底部的圆形按钮。在没有贴底时来了新消息，按钮文字会变成「有新消息」，未读分割线 `ChatUnreadDivider` 也会标出新旧分界线。
- `ChatComposer` 是底部的输入套件，放进 `ChatLayout` 的 `composer` 插槽里。它负责草稿状态、回车发送、Shift 加回车换行、停止生成按钮等。它还支持附件抽屉以及基于浏览器原生语音识别的麦克风听写功能。落地页和带文档面板的整页会话见[应用模式](/guide/patterns)。

```vue
<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'

function onSubmit(value: string) {
  console.log(value)
}
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
      <ChatComposer placeholder="输入消息……" @submit="onSubmit" />
    </template>
  </ChatLayout>
</template>
```

- `ChatMessageList` 是承载消息记录的列表容器，带有 `role="log"`。当 AI 助手的文字还在持续生成时传入 `isStreaming`，读屏软件会等整段输出完毕后再统一朗读，避免不断打扰用户。当用户向上翻到顶部时，`scrollToTopAction` 会触发加载历史消息，加载完成前顶部会显示旋转动画。
- `ChatMessage` 代表单条消息行。`sender` 可以是 `user`（用户）、`assistant`（AI 助手）或 `system`（系统通知）。系统通知会默认水平居中。
- `ChatToolCalls` 用来展示 AI 调用的外部工具或函数。只有一次调用时直接显示一行；多次调用时会收拢进折叠栏，点击可以查看参数与结果明细。
- `ChatReasoning` 是折叠卡片，用来展示 AI 的思考推理过程，默认折叠收起。
- `ChatTypingIndicator` 用来展示「正在输入」的跳动三个小圆点，告诉用户对方正在打字或 AI 正在构思。

下面先看输入套件和消息列表放在一起的样子，再按布局、回到底部、消息、气泡、列表、元信息、系统消息、工具调用往下排。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 记录放进消息列表，输入套件放进底部插槽，磨砂和回到底部的按钮才对得齐。 |
| <Badge variant="success">推荐</Badge> | 助手正文还在增长时保持 `isStreaming`，写完再关掉。 |
| <Badge variant="success">推荐</Badge> | 把 `ChatUnreadDivider` 放在读者还没看到的第一条前面。按钮上的「有新消息」负责播报，分隔线负责标位置。 |
| <Badge variant="success">推荐</Badge> | 气泡里放纯文本、引文，或你自己的渲染结果。气泡只提供底色和圆角。 |
| <Badge variant="error">避免</Badge> | 在布局里面再套一个滚动容器。记录的滚动只交给布局自己，或者交给 `scrollRef` 指向的那个元素。 |
| <Badge variant="error">避免</Badge> | 每个流式 token 都自己播报一遍。正在输入靠自己的 `role="status"` 播报一次，新消息文案走布局里的 live region。 |


<ComponentAnatomy />

## 示例

<DemoExample
  :demo="chatLayoutPanel"
  description="窄栏里的会话。输入文字后回车，这句话会出现在记录末尾。容器一窄就会用上紧凑密度。"
  locale="zh"
  title="ChatLayout — 面板"
/>

<DemoExample
  :demo="chatComposerShell"
  description="带附件抽屉、顶栏按钮和语音按钮的输入区。没有字时发送按钮是浅色并且不能点，写上字才变成可点的实心按钮。只有附件、没有字，仍然不能发送。点抽屉把手可以收起附件。点麦克风会在支持语音的浏览器里开始听写。"
  locale="zh"
  title="ChatComposer — 外壳"
/>

<DemoExample
  :demo="chatComposerStates"
  description="上面一条正在生成，编辑停用，停止按钮仍可点。中间是紧凑、无阴影，并带警告。下面把错误放在输入区上方。"
  locale="zh"
  title="ChatComposer — 状态"
/>

<DemoExample
  :demo="chatComposerMentions"
  description="词首输入 @ 可以连续打多个词，比如 Ada Lov，列表会跟着缩到 Ada Lovelace。方向键把高亮移到某一行，回车插入的是这一行，不是列表里的第一条。没有匹配的句子会把列表藏起来，已经打的字还在。词首输入 / 是单词命令，打一个空格列表就关上。选中的人变成标记，命令按原文插入。"
  locale="zh"
  title="ChatComposerInput — 提及"
/>

<DemoExample
  :demo="chatTokenized"
  description="同一组标记既能出现在输入框里，也能出现在已经发出的气泡里。"
  locale="zh"
  title="ChatTokenizedText — 气泡里的标记"
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
