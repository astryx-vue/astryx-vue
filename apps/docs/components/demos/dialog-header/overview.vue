<script setup lang="ts">
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
</script>

<template>
  <div class="input-preview-grid">
    <Dialog is-inline is-open width="100%">
      <DialogHeader
        title="Edit Profile"
        subtitle="Update your personal information"
        has-close-button
      />
      <p class="dialog-header-preview__body">
        Dialog body content goes here.
      </p>
    </Dialog>
  </div>
</template>
