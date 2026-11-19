<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <Toast type="info" body="Document saved successfully" :is-auto-hide="false" :auto-hide-duration="5000">
    <template #end>
      <Button
        label="Show toast"
        variant="ghost"
        size="sm"
        @click="toast({ body: 'Document saved successfully' })"
      />
    </template>
  </Toast>
  <ToastViewport />
</template>
