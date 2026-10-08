<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="alert-dialog-preview">
    <Button label="Delete project" variant="destructive" @click="isOpen = true" />
    <AlertDialog
      :is-open="isOpen"
      title="Delete project?"
      description="This cannot be undone. The project, its deployments, and every dashboard built on it are removed permanently."
      action-label="Delete project"
      @action="isOpen = false"
      @open-change="isOpen = $event"
    />
  </div>
</template>
