<script setup lang="ts">
import type { ChatDensity } from '@astryx-vue/core/Chat'
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const densities: { id: ChatDensity, label: string }[] = [
  { id: 'compact', label: pick('紧凑', 'Compact') },
  { id: 'balanced', label: pick('均衡', 'Balanced') },
  { id: 'spacious', label: pick('宽松', 'Spacious') },
]
</script>

<template>
  <div class="chat-preview-columns">
    <div v-for="density in densities" :key="density.id">
      <p class="chat-preview__caption">
        {{ density.label }}
      </p>
      <ChatMessageList class="chat-preview-pane" :density="density.id">
        <ChatMessage sender="assistant">
          <ChatMessageBubble group="first">
            {{ pick('构建用了 4.2 秒。', 'The build completed in 4.2 seconds.') }}
          </ChatMessageBubble>
          <ChatMessageBubble group="last">
            {{ pick('发到预发环境。', 'Ship it to staging.') }}
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </div>
  </div>
</template>
