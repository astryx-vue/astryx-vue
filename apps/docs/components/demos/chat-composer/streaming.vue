<script setup lang="ts">
import { ChatComposer } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isStreaming = ref(false)
const value = ref('Click the send button to start streaming.')

function onSubmit(): void {
  value.value = ''
  isStreaming.value = true
  setTimeout(() => {
    isStreaming.value = false
  }, 5000)
}

function onStop(): void {
  isStreaming.value = false
}
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text type="supporting" color="secondary">
        {{ isStreaming ? 'Streaming — click stop to cancel' : 'Send a message to start streaming' }}
      </Text>
      <ChatComposer
        v-model="value"
        placeholder="Send a message to start streaming..."
        :is-stop-shown="isStreaming"
        @submit="onSubmit"
        @stop="onStop"
      />
    </VStack>
  </VStack>
</template>
