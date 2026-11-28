<script setup lang="ts">
import type { ChatSystemMessageProps, ChatSystemMessageSlots } from './types.js'
import { useSlots } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import Divider from '../Divider/Divider.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatSystemMessage', inheritAttrs: false })

withDefaults(defineProps<ChatSystemMessageProps>(), {
  variant: 'default',
})
defineSlots<ChatSystemMessageSlots>()
const slots = useSlots()
</script>

<template>
  <div
    v-if="variant === 'divider'"
    v-bind="$attrs"
    class="astryx-chat-system-message"
    data-variant="divider"
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
  >
    <span class="astryx-chat-system-message__content">
      <span v-if="hasSlotContent(slots.icon)" class="astryx-chat-system-message__icon">
        <slot name="icon" />
      </span>
      <slot />
    </span>
  </div>
</template>
