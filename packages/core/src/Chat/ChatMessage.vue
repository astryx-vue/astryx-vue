<script setup lang="ts">
import type { ChatMessageProps, ChatMessageSlots } from './types.js'
import { computed, provide, useId, useSlots, useTemplateRef } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { chatMessageContextKey, useChatListContext } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatMessage', inheritAttrs: false })

const props = defineProps<ChatMessageProps>()
defineSlots<ChatMessageSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const list = useChatListContext()
const root = useTemplateRef<HTMLElement>('root')
const nameId = `astryx-chat-message-${useId()}`

const density = computed(() => props.density ?? list?.density.value ?? 'balanced')
const isSystem = computed(() => props.sender === 'system')
const hasName = computed(() => !isSystem.value && (Boolean(props.name) || Boolean(slots.name)))
const senderName = computed(() => {
  const chat = messages.value.chat
  if (props.sender === 'user')
    return chat.senderUser
  if (props.sender === 'system')
    return chat.senderSystem
  return chat.senderAssistant
})

provide(chatMessageContextKey, {
  sender: computed(() => props.sender),
  density,
})

defineExpose({ element: root })
</script>

<template>
  <article
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-message"
    :data-sender="sender"
    :data-density="density"
    :aria-label="hasName ? undefined : messages.chat.messageFrom(senderName)"
    :aria-labelledby="hasName ? nameId : undefined"
  >
    <div v-if="$slots.avatar && !isSystem" class="astryx-chat-message__avatar">
      <slot name="avatar" />
    </div>
    <div class="astryx-chat-message__column" :data-sender="sender">
      <div v-if="hasName" :id="nameId" class="astryx-chat-message__name" data-chat-name>
        <slot name="name">
          {{ name }}
        </slot>
      </div>
      <div class="astryx-chat-message__body" :data-sender="sender" :data-density="density">
        <slot />
      </div>
      <div v-if="!isSystem && $slots.metadata" class="astryx-chat-message__metadata">
        <slot name="metadata" />
      </div>
    </div>
  </article>
</template>
