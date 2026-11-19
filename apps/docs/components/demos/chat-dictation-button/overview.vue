<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { ChatComposer, ChatComposerInput, ChatDictationButton, useChatDictation } from '@astryx-vue/core/Chat'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { reactive, ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const dictation = reactive(useChatDictation({ input, hasSounds: true }))
</script>

<template>
  <VStack :gap="4" :width="450" max-width="100%">
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
    <HStack v-if="dictation.isListening" :gap="2" align="center">
      <Text type="supporting" color="secondary">
        {{ dictation.isSpeaking ? 'Speaking detected' : 'Listening...' }}
      </Text>
      <div class="chat-dictation-showcase__meter">
        <div
          class="chat-dictation-showcase__level"
          :class="{ 'chat-dictation-showcase__level--speaking': dictation.isSpeaking }"
          :style="{ width: `${Math.min(dictation.volume * 200, 100)}%` }"
        />
      </div>
    </HStack>
    <Text v-if="!dictation.isSupported" type="supporting" color="accent">
      SpeechRecognition is not supported in this browser.
    </Text>
  </VStack>
</template>

<style scoped>
.chat-dictation-showcase__meter {
  width: 80px;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background-color: var(--astryx-color-background-muted);
}

.chat-dictation-showcase__level {
  height: 100%;
  border-radius: 3px;
  background-color: var(--astryx-color-text-secondary);
  transition: width 0.08s ease-out;
}

.chat-dictation-showcase__level--speaking {
  background-color: var(--astryx-color-accent);
}
</style>
