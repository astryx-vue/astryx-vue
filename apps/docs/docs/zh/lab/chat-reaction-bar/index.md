---
title: ChatReactionBar
---

# ChatReactionBar

在一条消息下面排一行表情回应。每个胶囊显示表情和数量；当前用户自己的回应带强调色，并且 `aria-pressed="true"`。监听 `add` 时，末尾会出现添加按钮，打开 `ChatEmojiPicker`。

<script setup lang="ts">
import { labChatReactionBar } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatReactionBar" description="点已有回应会切换自己的状态；点加号可以从选择器里再加一个。" locale="zh" title="基本用法" /></ClientOnly>

这个组件属于 `@astryx-vue/lab`，只通过 `canary` 标签发布。

## 导入

```ts
import { ChatReactionBar } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `reactions` | `ChatReaction[]` | 必填 | 按显示顺序排列。`isSelected` 表示当前用户已回应。`label` 同时作为提示和无障碍名。 |
| `emojis` | `readonly ChatEmojiOption[]` | `DEFAULT_CHAT_EMOJIS` | 添加按钮打开的选择器里的表情。 |
| `addLabel` | `string` | 文案键 `@astryx.comments.addReaction` | 添加按钮和选择器对话框的无障碍名。 |
| `label` | `string` | `'Reactions'` | 这一组的无障碍名。 |

没有 `label` 时，胶囊的无障碍名按数量生成，例如 `1 reaction with 🔥`、`2 reactions with 👀`。

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `toggle` | `emoji: string` | 用户点了某个已有回应。 |
| `add` | `emoji: string` | 用户从选择器里新加了一个表情。没有监听这个事件时，不渲染添加按钮。 |

禁用或 `aria-disabled="true"` 的胶囊和添加按钮不再显示悬停边框，指针也回到普通箭头。组件本身没有单独的 busy 状态。
