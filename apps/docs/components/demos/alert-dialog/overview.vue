<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
</script>

<template>
  <div class="alert-dialog-preview">
    <AlertDialog
      is-inline
      is-open
      width="100%"
      title="Delete project?"
      description="This cannot be undone. The project, its deployments, and every dashboard built on it are removed permanently."
      action-label="Delete project"
    />
  </div>
</template>
