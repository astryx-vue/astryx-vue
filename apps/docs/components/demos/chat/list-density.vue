<script setup lang="ts">
import type { AvatarSize } from '@astryx-vue/core/Avatar'
import type { ChatDensity } from '@astryx-vue/core/Chat'
import { Avatar } from '@astryx-vue/core/Avatar'
import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryx-vue/core/Chat'
import { Divider } from '@astryx-vue/core/Divider'

const agent = 'Agent'

const densities: { id: ChatDensity, label: string, avatar: AvatarSize }[] = [
  { id: 'compact', label: 'Compact', avatar: 'sm' },
  { id: 'balanced', label: 'Balanced', avatar: 'md' },
  { id: 'spacious', label: 'Spacious', avatar: 'md' },
]
</script>

<template>
  <div class="chat-preview-densities">
    <template v-for="(density, index) in densities" :key="density.id">
      <Divider v-if="index > 0" />
      <div>
        <p class="chat-preview__caption">
          {{ density.label }}
        </p>
        <ChatMessageList :density="density.id">
          <ChatMessage sender="user">
            <ChatMessageBubble>
              {{ 'How does density work?' }}
            </ChatMessageBubble>
          </ChatMessage>
          <ChatMessage sender="assistant">
            <template #avatar>
              <Avatar :name="agent" :size="density.avatar" />
            </template>
            <ChatMessageBubble>
              {{ 'Density provides default spacing at every level — message gap, bubble padding, and gap between child elements. Use gap to tune row spacing independently.' }}
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
      </div>
    </template>
  </div>
</template>
