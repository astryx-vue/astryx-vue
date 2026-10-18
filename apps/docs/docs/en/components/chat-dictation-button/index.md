---
layout: component-docs
title: Chat Dictation Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatDictationButtonBasic } from '../../../../components/demos/chat-dictation-button'
</script>

## Usage

ChatDictationButton is a toggle button that starts and stops voice dictation inside a chat composer. It pairs with `useChatDictation` to show a microphone icon when idle and animated frequency bars when listening. Place it in the `sendActions` slot of ChatComposer.

```ts
import { ChatDictationButton } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Place the dictation button in the `sendActions` slot of ChatComposer so it sits next to the send button where users expect voice input controls. |
| <Badge variant="success">Do</Badge> | Pass the input handle to `useChatDictation` so interim transcripts appear as ghost text in the composer input while the user speaks. |
| <Badge variant="success">Do</Badge> | Enable `hasSounds` on `useChatDictation` to give users audio feedback when dictation starts and stops. This is especially helpful when the button's visual change is subtle. |
| <Badge variant="error">Don't</Badge> | Don't use the dictation button outside a chat composer context. It's designed for the composer's send-action layout, not as a standalone recording control. |
| <Badge variant="error">Don't</Badge> | Don't forget to handle the unsupported case. The button hides itself by default when the browser lacks SpeechRecognition, but you should still design the composer to work without it. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatDictationButtonBasic"
  description="A dictation button wired to useChatDictation and placed in the sendActions slot of a ChatComposer. Click the microphone to transcribe speech into the input."
  locale="en"
  title="ChatDictationButton — Basic"
/>
