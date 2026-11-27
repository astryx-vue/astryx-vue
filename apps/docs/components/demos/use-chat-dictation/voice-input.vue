<script setup lang="ts">
import type { ChatComposerInputHandle } from '@astryx-vue/core/Chat'
import { Button } from '@astryx-vue/core/Button'
import { ChatComposerInput, useChatDictation } from '@astryx-vue/core/Chat'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const input = ref<ChatComposerInputHandle | null>(null)
const dictation = useChatDictation({ input })
const status = computed(() => {
  if (!dictation.isSupported.value)
    return 'This browser has no speech recognition'
  return dictation.isListening.value ? 'Listening' : 'Ready'
})
</script>

<template>
  <VStack :gap="3" width="100%">
    <Text type="body">
      {{ status }}
    </Text>
    <ChatComposerInput ref="input" label="Message" />
    <HStack>
      <Button
        :label="dictation.isListening.value ? 'Stop' : 'Start'"
        variant="secondary"
        :is-disabled="!dictation.isSupported.value"
        @click="dictation.toggle"
      />
    </HStack>
  </VStack>
</template>
