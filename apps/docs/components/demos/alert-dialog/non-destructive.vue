<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="alert-dialog-preview">
    <Button label="Publish changes" variant="secondary" @click="isOpen = true" />
    <AlertDialog
      :is-open="isOpen"
      action-label="Publish now"
      action-variant="primary"
      cancel-label="Keep editing"
      description="Publishing pushes this draft to the live site and notifies 1,240 subscribers."
      title="Publish this draft?"
      @action="isOpen = false"
      @open-change="isOpen = $event"
    />
  </div>
</template>
