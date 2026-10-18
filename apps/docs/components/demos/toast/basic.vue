<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function showInfo() {
  toast({ body: 'An update is available.', autoHideDuration: 5000 })
}

function showSuccess() {
  toast({ body: 'Changes saved.', type: 'success', autoHideDuration: 5000 })
}

function showError() {
  toast({ body: 'Failed to upload file.', type: 'error', autoHideDuration: 5000 })
}
</script>

<template>
  <div class="toast-preview__row">
    <button class="toast-preview__trigger" @click="showInfo">
      Info
    </button>
    <button class="toast-preview__trigger" @click="showSuccess">
      Success
    </button>
    <button class="toast-preview__trigger" @click="showError">
      Error
    </button>
    <ToastViewport />
  </div>
</template>
