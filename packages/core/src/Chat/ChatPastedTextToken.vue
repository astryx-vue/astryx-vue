<script setup lang="ts">
import { computed } from 'vue'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import HoverCard from '../HoverCard/HoverCard.vue'
import { useAstryxMessages } from '../locale/index.js'
import { pastedTextLabel } from './useChatPasteAsToken.js'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  expand: []
}>()

const messages = useAstryxMessages()
const label = computed(() => pastedTextLabel(props.text))
</script>

<template>
  <HoverCard placement="above" alignment="start" :has-hover-indication="false">
    <Badge :label="label" variant="neutral" />
    <template #content>
      <div class="astryx-chat-paste">
        <div class="astryx-chat-paste__text">
          {{ text }}
        </div>
        <div class="astryx-chat-paste__footer">
          <span class="astryx-chat-paste__meta">{{ label }}</span>
          <Button
            :label="messages.chat.expandPastedText"
            variant="ghost"
            size="sm"
            @click="emit('expand')"
          />
        </div>
      </div>
    </template>
  </HoverCard>
</template>
