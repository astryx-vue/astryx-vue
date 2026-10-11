<script setup lang="ts">
import type { ChatLayoutScrollButtonEmits, ChatLayoutScrollButtonProps } from './types.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatLayoutScrollButton', inheritAttrs: false })

const props = defineProps<ChatLayoutScrollButtonProps>()
const emit = defineEmits<ChatLayoutScrollButtonEmits>()
const messages = useAstryxMessages()

const accessibleLabel = computed(() => props.label ?? messages.value.chat.scrollToBottom)
</script>

<template>
  <div v-bind="$attrs" class="astryx-chat-scroll-button">
    <div
      class="astryx-chat-scroll-button__pill"
      :data-visible="isVisible || undefined"
      :data-labeled="label ? '' : undefined"
      :inert="!isVisible"
    >
      <Button
        class="astryx-chat-scroll-button__control"
        :label="accessibleLabel"
        variant="ghost"
        size="md"
        :is-icon-only="!label"
        @click="emit('click')"
      >
        <template #icon>
          <Icon icon="chevronDown" size="md" />
        </template>
      </Button>
    </div>
  </div>
</template>
