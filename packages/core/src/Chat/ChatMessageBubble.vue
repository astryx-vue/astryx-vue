<script setup lang="ts">
import type { ChatMessageBubbleProps, ChatMessageBubbleSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import { useChatMessageContext } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatMessageBubble', inheritAttrs: false })

const props = withDefaults(defineProps<ChatMessageBubbleProps>(), {
  variant: 'filled',
})
defineSlots<ChatMessageBubbleSlots>()

const context = useChatMessageContext()
const root = useTemplateRef<HTMLDivElement>('root')
const sender = computed(() => context?.sender.value ?? 'assistant')
const density = computed(() => context?.density.value ?? 'balanced')
const frameStyle = computed(() => props.width ? { width: props.width, maxWidth: props.width } : undefined)

defineExpose({ element: root })
</script>

<template>
  <div
    class="astryx-chat-message-bubble__frame"
    :data-sender="sender"
    :data-variant="variant"
    :data-density="density"
    :style="frameStyle"
  >
    <div
      v-if="name || $slots.name"
      class="astryx-chat-message-bubble__name"
      data-chat-name
      :data-sender="sender"
      :data-density="density"
    >
      <slot name="name">
        {{ name }}
      </slot>
    </div>
    <div
      ref="root"
      v-bind="$attrs"
      class="astryx-chat-message-bubble"
      :data-sender="sender"
      :data-variant="variant"
      :data-density="density"
      :data-group="group"
    >
      <slot />
    </div>
    <div
      v-if="$slots.metadata"
      class="astryx-chat-message-bubble__meta"
      :data-sender="sender"
      :data-density="density"
    >
      <slot name="metadata" />
    </div>
  </div>
</template>
