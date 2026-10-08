<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="input-preview-grid">
    <Button label="Share project" variant="secondary" @click="isOpen = true" />
    <Dialog :is-open="isOpen" width="420" @open-change="isOpen = $event">
      <VStack :gap="3">
        <DialogHeader
          title="Share project"
          subtitle="Anyone with the link can view."
          has-close-button
          @open-change="isOpen = $event"
        />
        <p>Copy the link below and send it to your team. You can change access at any time from project settings.</p>
        <Button label="Done" variant="primary" @click="isOpen = false" />
      </VStack>
    </Dialog>
  </div>
</template>
