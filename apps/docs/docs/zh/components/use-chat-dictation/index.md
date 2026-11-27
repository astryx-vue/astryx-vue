---
layout: component-docs
title: useChatDictation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useChatDictationVoiceInput } from '../../../../components/demos/use-chat-dictation'
</script>

## 使用方法

聊天输入框的语音输入。它在 `useSpeechRecognition` 之上加了开始和停止的提示音，还可以把中间转写直接显示在 `ChatComposerInput` 里。提供控件之前先看 `isSupported`：没有语音识别的浏览器会报告 `false`，也不会去听。持续大声说话时，转写会变成大写。把同一个返回值交给 `ChatDictationButton` 即可。

```ts
import { useChatDictation } from '@astryx-vue/core/Chat'
```

```vue
<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { ChatComposerInput, ChatDictationButton, useChatDictation } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const dictation = useChatDictation({
  input,
  onError: error => console.warn(error.error),
})
</script>

<template>
  <ChatComposerInput ref="input" />
  <ChatDictationButton :dictation="dictation" />
</template>
```

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">建议</Badge> | 想让文字出现在输入框里就传 `input`。hook 会把每段最终转写插进去，同时仍然调用 `onResult`。 |
| <Badge variant="success">建议</Badge> | `isSupported` 为假时禁用控件，并说明这个浏览器不能语音输入。 |
| <Badge variant="success">建议</Badge> | 处理 `onError`。麦克风权限被拒绝，只有它能告诉你。 |
| <Badge variant="error">避免</Badge> | 在这个 hook 旁边再去调用浏览器的 `SpeechRecognition`。不需要输入框配合时才用 `useSpeechRecognition`。 |

## 示例

<DemoExample
  :demo="useChatDictationVoiceInput"
  description="用 useChatDictation 填充的输入框。还没说完的词以灰色提示显示在输入框里，说完的每一句只插入一次。Start 和 Stop 切换收听，没有语音识别的浏览器里 Start 不可用。"
  locale="zh"
  title="useChatDictation —— 语音输入"
/>
