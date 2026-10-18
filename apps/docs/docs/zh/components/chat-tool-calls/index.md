---
layout: component-docs
title: 对话工具调用
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatToolCallsExpandable, chatToolCallsSimple, chatToolCallsStatuses } from '../../../../components/demos/chat-tool-calls'
</script>

## 使用方法

`ChatToolCalls` 用来显示大模型这一轮都调了哪些工具、函数。传一组调用进去就行：只有一条时直接排成一行；有好几条时收成一个摘要，最近调的那条露在外面。凡是 AI 助手要交代自己干了什么的地方都能用。

数组为空时什么都不渲染。多条会收成一行表头，表头上显示最近那次调用；点一下就在摘要和完整列表之间切换。`v-model:is-expanded` 控制展开状态，`default-is-expanded` 是没绑 `v-model` 时的初始状态。展开后 `label` 会替掉本地化的调用条数。某条调用带 `detail`，或者你给了 `detail` 插槽，它自己还能再展开。

```vue
<script setup lang="ts">
import { ChatMessage, ChatToolCalls } from '@astryx-vue/core/Chat'

const calls = [
  { name: 'bash', status: 'complete' as const, target: 'git status', duration: '1.2s' },
]
</script>

<template>
  <ChatMessage sender="assistant">
    <ChatToolCalls :calls="calls" />
  </ChatMessage>
</template>
```

<ComponentAnatomy />

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每次调用都带上 target，让人看得出工具动了什么：文件路径、shell 命令，或者搜索词。 |
| <Badge variant="success">推荐</Badge> | 已完成的调用显示耗时，用户才知道哪个工具慢、这次回答为什么久。 |
| <Badge variant="success">推荐</Badge> | 自动生成的条数说不清这组调用在干什么时，用 `label` 自己写一句。 |
| <Badge variant="success">推荐</Badge> | 会产出结果的调用，用 `detail` 配一个代码块（改动的 diff、命令的终端输出），用户就能就地查看。 |
| <Badge variant="success">推荐</Badge> | 流式追加时给每条调用一个唯一的 `key`，Vue 才能只给新行做动画，不会把已完成的行拆掉重建。 |
| <Badge variant="error">避免</Badge> | 省掉 status。不写默认算完成，对还在跑或者已经失败的调用是误导。 |
| <Badge variant="error">避免</Badge> | 把工具调用摆在对话消息之外。它本来就该待在助手消息里，不是独立的界面。 |
| <Badge variant="error">避免</Badge> | 给每条调用自己包一层容器。一条还是多条，组件会按数组长度自己决定排版。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="chatToolCallsExpandable" title="可展开" description="每条调用都能展开看结果，diff 和命令输出用代码块显示。点一行就展开。" locale="zh" />

<DemoExample :demo="chatToolCallsSimple" title="简单" description="上面是一条单独的工具调用，下面是一组可收起的多条调用，带增删行数。两种排版放在一起对比。" locale="zh" />

<DemoExample :demo="chatToolCallsStatuses" title="状态" description="四种状态（等待中、运行中、已完成、出错）放在同一组里一起看。" locale="zh" />
