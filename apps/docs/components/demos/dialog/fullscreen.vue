<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="input-preview-grid">
    <Button label="Open editor" variant="secondary" @click="isOpen = true" />
    <Dialog :is-open="isOpen" variant="fullscreen" @open-change="isOpen = $event">
      <DialogHeader title="Edit notes" has-close-button @open-change="isOpen = $event" />
      <p>Fullscreen dialogs suit long editing tasks. The content fills the viewport and respects safe areas.</p>
    </Dialog>
  </div>
</template>
