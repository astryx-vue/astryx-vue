<script setup lang="ts">
import type { ChatSystemMessageProps, ChatSystemMessageSlots } from './types.js'
import Divider from '../Divider/Divider.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatSystemMessage', inheritAttrs: false })

withDefaults(defineProps<ChatSystemMessageProps>(), {
  variant: 'default',
})
defineSlots<ChatSystemMessageSlots>()
</script>

<template>
  <div
    v-if="variant === 'divider'"
    v-bind="$attrs"
    class="astryx-chat-system-message"
    data-variant="divider"
    role="status"
  >
    <Divider>
      <template #label>
        <slot />
      </template>
    </Divider>
  </div>
  <div
    v-else
    v-bind="$attrs"
    class="astryx-chat-system-message"
    data-variant="default"
    role="status"
  >
    <span class="astryx-chat-system-message__content">
      <span v-if="$slots.icon" class="astryx-chat-system-message__icon">
        <slot name="icon" />
      </span>
      <slot />
    </span>
  </div>
</template>
