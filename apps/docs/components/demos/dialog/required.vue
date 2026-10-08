<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="input-preview-grid">
    <Button label="Delete project" variant="destructive" @click="isOpen = true" />
    <Dialog :is-open="isOpen" purpose="required" @open-change="isOpen = $event">
      <DialogHeader title="Delete this project?" subtitle="This cannot be undone." />
      <p>Escape and clicks outside the dialog are disabled. Choose an action to continue.</p>
      <Button label="Delete" variant="destructive" @click="isOpen = false" />
      <Button label="Cancel" variant="ghost" @click="isOpen = false" />
    </Dialog>
  </div>
</template>
