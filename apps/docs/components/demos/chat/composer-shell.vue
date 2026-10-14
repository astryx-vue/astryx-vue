<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { ChatComposer, ChatComposerDrawer, ChatDictationButton } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { reactive, ref } from 'vue'

const listening = ref(false)
const dictation = reactive({
  isSupported: true,
  bands: [0.12, 0.4, 0.72, 0.36, 0.16],
  volume: 0.05,
  get isListening() {
    return listening.value
  },
  toggle() {
    listening.value = !listening.value
  },
})
const sent = ref('')

function onSubmit(value: string): void {
  sent.value = value
}
</script>

<template>
  <div class="chat-preview-composer">
    <ChatComposer placeholder="Ask about the notes..." @submit="onSubmit">
      <template #drawer>
        <ChatComposerDrawer :count="2" label="Attachments">
          <Badge label="notes.md" variant="neutral" />
          <Badge label="focus.png" variant="neutral" />
        </ChatComposerDrawer>
      </template>
      <template #headerActions>
        <IconButton label="Add attachment" size="sm" variant="ghost">
          <Icon name="carbon:attachment" />
        </IconButton>
      </template>
      <template #headerContext>
        Balanced
      </template>
      <template #footerActions>
        <ChatDictationButton :dictation="dictation" />
      </template>
    </ChatComposer>
    <p v-if="sent" class="chat-preview__caption">
      {{ sent }}
    </p>
  </div>
</template>
