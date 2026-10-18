---
layout: component-docs
title: 发送按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatSendButtonCustomIcon, chatSendButtonInComposer, chatSendButtonStates } from '../../../../components/demos/chat-send-button'
</script>

## 使用方法

`ChatSendButton` 就是输入区里那颗要「发送」还是「停止」的按钮。放在 `ChatComposer` 里面时，它自己从上下文里知道现在能不能发、是不是在流式输出、该回调谁；单独用的话，这些状态要你自己传。

```ts
import { ChatSendButton } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 希望发送和停止的行为跟着输入区走，就把它放进 `ChatComposer`。 |
| <Badge variant="success">推荐</Badge> | 单独用时，把状态和对应的 `send` 或 `stop` 监听都显式给全。 |
| <Badge variant="success">推荐</Badge> | 换成自己的图标时，别把本地化的「发送」「停止」无障碍名字弄丢。图标只是装饰，不能成为唯一的名字来源。 |
| <Badge variant="error">避免</Badge> | 停止状态下没有可用的停止处理函数，属性里也没给、上下文里也没有。 |
| <Badge variant="error">避免</Badge> | 以为 `isDisabled` 会禁用停止。它只管发送那一边。 |

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatSendButtonCustomIcon"
  description="用 sendIcon 和 stopIcon 插槽换成自己的图标。想让对话有点性格就用它：发消息用纸飞机，AI 生成用闪闪，确认流程用对勾。"
  locale="zh"
  title="ChatSendButton — 自定义图标"
/>

<DemoExample
  :demo="chatSendButtonInComposer"
  description="放在输入区里的发送按钮，状态全从上下文自己读。不用接线，输入框有内容它就亮起来。"
  locale="zh"
  title="ChatSendButton — 在输入区里"
/>

<DemoExample
  :demo="chatSendButtonStates"
  description="不能发、可以发、正在流式输出三种状态。按钮会根据流式状态自动在主色的发送和次色的停止之间切换。"
  locale="zh"
  title="ChatSendButton — 各种状态"
/>
