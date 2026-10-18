---
layout: component-docs
title: 对话输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatComposerInputControlled, chatComposerInputDisabled, chatComposerInputMentions, chatComposerInputMultipleTriggers, chatComposerInputSlashCommands } from '../../../../components/demos/chat-composer-input'
</script>

## 使用方法

草稿需要「敲一个字符弹出候选列表」、行内标签、上下键翻历史、语音转写插入、或者接收文件时，把 `ChatComposerInput` 放进 `ChatComposer` 的 `input` 插槽。

```ts
import { ChatComposerInput } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 要用代码往里面塞文字或标签，用组件暴露出来的那组方法；塞进去的内容和手动输入走同一条 `change` 流程。 |
| <Badge variant="success">推荐</Badge> | 粘贴或拖进来的文件通过 `files` 事件接住，文件校验和上传进度留在业务层做。 |
| <Badge variant="error">避免</Badge> | 普通的提及和命令也用自定义标签渲染。用结构化的徽标形式就好，标签才可控、也才能跟着主题走。 |

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatComposerInputControlled"
  description="受控的输入框，下面实时显示当前的值。需要在输入区外面读草稿、或者改写草稿时，用受控模式。"
  locale="zh"
  title="ChatComposerInput — 受控"
/>

<DemoExample
  :demo="chatComposerInputDisabled"
  description="禁用状态的输入区。输入框要看得见但不能操作时用它，例如正在流式输出，或者某个前置条件还没满足。"
  locale="zh"
  title="ChatComposerInput — 禁用"
/>

<DemoExample
  :demo="chatComposerInputMentions"
  description="敲 @ 会弹出人员候选列表。选中的人变成行内标签。"
  locale="zh"
  title="ChatComposerInput — 提及"
/>

<DemoExample
  :demo="chatComposerInputMultipleTriggers"
  description="同时支持 @ 提及和 / 命令。两种标签用不同颜色，用户一眼能分清。"
  locale="zh"
  title="ChatComposerInput — 多种触发"
/>

<DemoExample
  :demo="chatComposerInputSlashCommands"
  description="敲 / 选命令的输入框。支持固定指令的 AI 助手或机器可以用它。"
  locale="zh"
  title="ChatComposerInput — 斜杠命令"
/>
