<script setup lang="ts">
import { LayerProvider } from '@astryx-vue/core/LayerProvider'
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

// Pin the toast viewport to the top end, keep two on screen, and clear the top edge by 8px.
const toastConfig = {
  position: 'top-end' as const,
  maxVisible: 2,
  inset: { blockStart: 8 },
}

function showToasts() {
  toast({ body: 'Draft saved.', type: 'success' })
  toast({ body: 'Syncing 3 files…' })
  toast({ body: 'Storage is nearly full.', type: 'warning' })
}
</script>

<template>
  <div class="layer-provider-preview">
    <LayerProvider :toast="toastConfig">
      <button class="layer-provider-preview__trigger" type="button" @click="showToasts">
        Show toasts
      </button>
      <ToastViewport />
    </LayerProvider>
  </div>
</template>
