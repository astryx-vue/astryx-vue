<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { ChatComposer, ChatComposerInput, ChatDictationButton, useChatDictation } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { reactive, ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const dictation = reactive(useChatDictation({ input }))
</script>

<template>
  <VStack :gap="4">
    <Text type="supporting" color="secondary">
      Click the microphone to start dictating. Speech is transcribed into the input.
    </Text>
    <ChatComposer>
      <template #input>
        <ChatComposerInput ref="input" />
      </template>
      <template #sendActions>
        <ChatDictationButton :dictation="dictation" />
      </template>
    </ChatComposer>
  </VStack>
</template>
