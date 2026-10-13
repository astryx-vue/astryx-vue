<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { ref } from 'vue'

const isLoading = ref(false)

async function revoke(): Promise<void> {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}
</script>

<template>
  <AlertDialog
    is-inline
    is-open
    action-label="Revoke"
    description="This user will immediately lose access to all shared resources."
    :is-action-loading="isLoading"
    title="Revoke access?"
    @action="revoke"
    @open-change="() => {}"
  />
</template>
