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

## Usage

Turns a long plain-text paste into a token chip in a `ChatComposerInput`. Short pastes are left for the composer to insert. The input already does this with a threshold of 200 characters; call the hook to change the threshold or the chip. Pass the whole object this hook returns as `ChatComposerInput`'s `pasteAsToken`. That prop does not take the `onPaste` function by itself.

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
  toToken: text => ({ value: text, label: `Pasted ${text.length} chars`, variant: 'neutral' }),
})
</script>

<template>
  <ChatComposerInput ref="input" :paste-as-token="pasteAsToken" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use one ref for the composer handle and for this hook, so `insertToken` reaches that input. |
| <Badge variant="success">Do</Badge> | Pass `:paste-as-token="false"` when every paste should stay inline text. |
| <Badge variant="error">Don't</Badge> | Insert a handled paste as both text and a token. Returning `true` tells the composer the paste is already handled. |

## Examples

<DemoExample
  :demo="useChatPasteAsTokenLongPaste"
  description="A composer whose pasteAsToken comes from useChatPasteAsToken with a threshold of 40 and a Pasted note label. A paste longer than 40 characters becomes that token, and a shorter paste stays as text."
  locale="en"
  title="useChatPasteAsToken — Long paste"
/>
