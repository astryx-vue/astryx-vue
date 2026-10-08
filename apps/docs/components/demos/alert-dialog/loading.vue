<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'
import { ref } from 'vue'

const isOpen = ref(false)
const isActionLoading = ref(false)

async function revoke(): Promise<void> {
  isActionLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1400))
  isActionLoading.value = false
  isOpen.value = false
}
</script>

<template>
  <div class="alert-dialog-preview">
    <Button label="Revoke access" variant="destructive" @click="isOpen = true" />
    <AlertDialog
      :is-action-loading="isActionLoading"
      :is-open="isOpen"
      action-label="Revoke access"
      description="This member loses access to every shared folder and draft immediately."
      title="Revoke access?"
      @action="revoke"
      @open-change="isOpen = $event"
    />
  </div>
</template>
