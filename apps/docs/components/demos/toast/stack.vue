<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function showStack() {
  toast({ body: 'An update is available.', autoHideDuration: 8000 })
  setTimeout(toast, 400, { body: 'Changes saved.', type: 'success', autoHideDuration: 8000 })
  setTimeout(toast, 800, { body: 'Storage is nearly full.', type: 'warning', autoHideDuration: 8000 })
  setTimeout(toast, 1200, { body: 'Changes could not be saved.', type: 'error', autoHideDuration: 8000 })
}
</script>

<template>
  <div class="toast-preview__row">
    <button class="toast-preview__trigger" @click="showStack">
      Show stack
    </button>
    <ToastViewport />
  </div>
</template>
