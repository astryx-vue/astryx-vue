---
layout: component-docs
title: useSpeechRecognition
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

Headless wrapper around the browser speech recognition API, with a microphone level and frequency bands. Check `isSupported` before offering the control: a browser without speech recognition reports `false` and does not listen, and no speech service is bundled. `isSupported` is `false` on the server and in the render that hydrates server markup, then turns `true` after mount, so server and client draw the same tree.

```ts
import { useSpeechRecognition } from '@astryx-vue/core/Chat'
```

```vue
<script setup lang="ts">
import { useSpeechRecognition } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const transcript = ref('')
const speech = useSpeechRecognition({
  onResult: (text) => { transcript.value += `${text} ` },
  onError: error => console.warn(error.error),
})
</script>

<template>
  <button v-if="speech.isSupported.value" type="button" @click="speech.toggle()">
    {{ speech.isListening.value ? 'Stop' : 'Start' }}
  </button>
  <p>{{ transcript }}{{ speech.interimTranscript.value }}</p>
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Offer the control only when `isSupported` is true, or keep it visible but disabled and say that this browser cannot take voice input. |
| <Badge variant="success">Do</Badge> | Handle `onError`. It is the only signal that microphone permission was refused. |
| <Badge variant="error">Don't</Badge> | Call the browser `SpeechRecognition` API beside this hook. Use `useChatDictation` when the words should go into a `ChatComposerInput`. |
