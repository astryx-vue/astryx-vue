<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function showToast(): void {
  toast({ body: 'Document saved successfully', type: 'success' })
}
</script>

<template>
  <div class="toast-preview__row">
    <Button label="Show toast" variant="secondary" @click="showToast" />
    <ToastViewport />
  </div>
</template>
