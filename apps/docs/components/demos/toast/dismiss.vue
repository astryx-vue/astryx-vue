<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'
import { ref } from 'vue'

const toast = useToast()
const dismiss = ref<(() => void) | null>(null)

function show(): void {
  dismiss.value = toast({ body: 'Uploading file…', autoClose: false })
}

function dismissFromCode(): void {
  dismiss.value?.()
  dismiss.value = null
}
</script>

<template>
  <VStack :gap="3">
    <Toast :auto-close="false" body="Uploading file…" type="info" />
    <HStack align="center" :gap="3">
      <Button label="Show toast" size="sm" variant="secondary" @click="show" />
      <Button label="Dismiss via code" size="sm" variant="ghost" @click="dismissFromCode" />
    </HStack>
    <ToastViewport />
  </VStack>
</template>
