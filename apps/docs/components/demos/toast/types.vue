<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <VStack :gap="3">
    <Toast :auto-close="false" body="Changes saved successfully." type="info">
      <template #end>
        <Button
          label="Show toast"
          size="sm"
          variant="ghost"
          @click="toast({ body: 'Changes saved successfully.', type: 'info' })"
        />
      </template>
    </Toast>
    <Toast :auto-close="false" body="Failed to save changes." type="error">
      <template #end>
        <Button
          label="Show toast"
          size="sm"
          variant="ghost"
          @click="toast({ body: 'Failed to save changes.', type: 'error' })"
        />
      </template>
    </Toast>
    <ToastViewport />
  </VStack>
</template>
