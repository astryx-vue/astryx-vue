<script setup lang="ts">
import type { ChatDensity } from '@astryx-vue/core/Chat'
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const agent = pick('助手', 'Agent')

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
        <ChatMessage sender="user">
          <ChatMessageBubble>
            {{ pick('密度是怎么起作用的？', 'How does density work?') }}
          </ChatMessageBubble>
        </ChatMessage>
        <ChatMessage sender="assistant">
          <template #avatar>
            <Avatar :name="agent" size="sm" />
          </template>
          <ChatMessageBubble variant="ghost">
            {{ pick('密度会给定每一层的默认间距：消息间距、气泡内边距，以及子元素之间的间隔。行距要单独调时，用 gap。', 'Density provides default spacing at every level — message gap, bubble padding, and gap between child elements. Use gap to tune row spacing independently.') }}
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </div>
  </div>
</template>
