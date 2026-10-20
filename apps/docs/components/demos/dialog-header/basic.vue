<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="input-preview-grid">
    <Button label="Invite teammates" variant="secondary" @click="isOpen = true" />
    <Dialog :is-open="isOpen" width="420" @open-change="isOpen = $event">
      <DialogHeader
        title="Invite teammates"
        subtitle="Send invitations to join your workspace"
        has-close-button
        @open-change="isOpen = $event"
      />
      <p>Anyone you invite can view the workspace right away. You can change their access later.</p>
      <Button label="Send invites" variant="primary" @click="isOpen = false" />
    </Dialog>
  </div>
</template>
