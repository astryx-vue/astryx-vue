<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <div class="input-preview-grid">
    <Dialog is-inline is-open width="100%">
      <VStack :gap="3">
        <DialogHeader title="Share project" subtitle="Anyone with the link can view." />
        <Button label="Done" variant="primary" />
      </VStack>
    </Dialog>
  </div>
</template>
