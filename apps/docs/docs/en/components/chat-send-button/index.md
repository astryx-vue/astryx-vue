---
layout: component-docs
title: Chat Send Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatSendButtonCustomIcon, chatSendButtonInComposer, chatSendButtonStates } from '../../../../components/demos/chat-send-button'
</script>

## Usage

Use ChatSendButton as ChatComposer’s send control when the action should switch between sending and stopping. Inside ChatComposer it reads readiness, streaming state, and action callbacks from context; standalone usage supplies those values explicitly.

```ts
import { ChatSendButton } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Place ChatSendButton inside ChatComposer when its readiness and send or stop lifecycle should follow composer context. |
| <Badge variant="success">Do</Badge> | For standalone use, provide the state and matching `send` or `stop` listener explicitly. |
| <Badge variant="success">Do</Badge> | Keep the translated Send or Stop accessible name intact when supplying custom icon artwork; the icon is decorative and must not be the only name source. |
| <Badge variant="error">Don't</Badge> | Render the stop state without a working stop handler from props or ChatComposer context. |
| <Badge variant="error">Don't</Badge> | Expect `isDisabled` to disable the stop action; it applies only to the send state. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatSendButtonCustomIcon"
  description="Send buttons with custom icons via sendIcon and stopIcon props. Use to match the personality of the chat experience: a paper airplane for messaging, sparkles for AI generation, or a check mark for confirmation flows."
  locale="en"
  title="ChatSendButton — Custom Icon"
/>

<DemoExample
  :demo="chatSendButtonInComposer"
  description="Send button inside ChatComposer, where it reads state from context automatically. No wiring needed; the button enables when the input has content."
  locale="en"
  title="ChatSendButton — In Composer"
/>

<DemoExample
  :demo="chatSendButtonStates"
  description="Disabled, ready, and streaming states at both sizes. The button automatically toggles between send (primary) and stop (secondary) based on streaming state."
  locale="en"
  title="ChatSendButton — States"
/>
