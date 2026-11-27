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

## Usage

Voice input for a chat composer. It wraps `useSpeechRecognition` with start and stop cues, and with optional interim text in a `ChatComposerInput`. Check `isSupported` before offering the control: a browser without speech recognition reports `false` and does not listen. Sustained loud speech turns the transcript to upper case. Pass the same return value to `ChatDictationButton`.

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

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass `input` when the words should appear in the composer. The hook inserts each final transcript there and still calls `onResult`. |
| <Badge variant="success">Do</Badge> | Disable the control when `isSupported` is false, and say that this browser cannot take voice input. |
| <Badge variant="success">Do</Badge> | Handle `onError`. It is the only signal that microphone permission was refused. |
| <Badge variant="error">Don't</Badge> | Call the browser `SpeechRecognition` API beside this hook. Use `useSpeechRecognition` only when the composer behavior is not wanted. |

## Examples

<DemoExample
  :demo="useChatDictationVoiceInput"
  description="A composer filled by useChatDictation. Partial words show in the composer as ghost text, and each finished phrase is inserted there once. Start and Stop toggle listening, and Start is disabled in a browser with no speech recognition."
  locale="en"
  title="useChatDictation — Voice input"
/>
