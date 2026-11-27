---
layout: component-docs
title: useChatPasteAsToken
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useChatPasteAsTokenLongPaste } from '../../../../components/demos/use-chat-paste-as-token'
</script>

## 使用方法

把一大段纯文本粘贴变成 `ChatComposerInput` 里的一个标签。短的粘贴留给输入框自己插入。输入框本来就按 200 个字符的阈值这么做；要改阈值或者改标签样式时才需要调用这个 hook。把 hook 返回的整个对象传给 `ChatComposerInput` 的 `pasteAsToken`，这个属性不接受单独的 `onPaste` 函数。

```ts
import { useChatPasteAsToken } from '@astryx-vue/core/Chat'
```

```vue
<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { ChatComposerInput, useChatPasteAsToken } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const pasteAsToken = useChatPasteAsToken({
  input,
  threshold: 40,
  toToken: text => ({ value: text, label: `已粘贴 ${text.length} 字`, variant: 'neutral' }),
})
</script>

<template>
  <ChatComposerInput ref="input" :paste-as-token="pasteAsToken" />
</template>
```

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">建议</Badge> | 输入框的句柄和这个 hook 用同一个 ref，`insertToken` 才会落到这个输入框里。 |
| <Badge variant="success">建议</Badge> | 想让每次粘贴都保持成文字，传 `:paste-as-token="false"`。 |
| <Badge variant="error">避免</Badge> | 把已经处理的粘贴既当文字又当标签再插一遍。`onPaste` 返回 `true` 就是在告诉输入框这次粘贴已经处理完了。 |

## 示例

<DemoExample
  :demo="useChatPasteAsTokenLongPaste"
  description="输入框的 pasteAsToken 来自 useChatPasteAsToken，阈值 40，标签是 Pasted note。超过 40 个字符的粘贴会变成这个小块，更短的粘贴仍是文本。"
  locale="zh"
  title="useChatPasteAsToken —— 长文本粘贴"
/>
