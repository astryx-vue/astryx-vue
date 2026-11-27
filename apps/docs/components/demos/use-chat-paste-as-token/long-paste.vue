<script setup lang="ts">
import type { ChatComposerInputHandle, ChatComposerToken } from '@astryx-vue/core/Chat'
import { ChatComposerInput, useChatPasteAsToken } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const pasteAsToken = useChatPasteAsToken({
  input,
  threshold: 40,
  toToken: (text: string): ChatComposerToken => ({ value: text, label: 'Pasted note', variant: 'neutral' }),
})
</script>

<template>
  <ChatComposerInput ref="input" label="Message" :paste-as-token="pasteAsToken" />
</template>
