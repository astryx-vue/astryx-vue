<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'
import { ref } from 'vue'

const messages = [
  { body: 'Changes saved.', type: 'info' as const },
  { body: 'Failed to upload file.', type: 'error' as const },
  { body: 'Message sent to Sarah Chen.', type: 'info' as const },
]

const toast = useToast()
const count = ref(0)

function show(): void {
  const message = messages[count.value % messages.length]
  count.value += 1
  toast(message)
}
</script>

<template>
  <VStack :gap="3">
    <Toast
      v-for="message in messages"
      :key="message.body"
      :is-auto-hide="false"
      :body="message.body"
      :type="message.type"
    />
    <Button label="Show toast" size="sm" variant="secondary" @click="show" />
    <ToastViewport />
  </VStack>
</template>
