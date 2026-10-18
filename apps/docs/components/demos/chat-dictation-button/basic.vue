<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { ChatComposer, ChatComposerInput, ChatDictationButton, useChatDictation } from '@astryx-vue/core/Chat'
import { reactive, ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const dictation = reactive(useChatDictation({ input }))
</script>

<template>
  <ChatComposer>
    <template #input>
      <ChatComposerInput ref="input" />
    </template>
    <template #sendActions>
      <ChatDictationButton :dictation="dictation" />
    </template>
  </ChatComposer>
</template>
