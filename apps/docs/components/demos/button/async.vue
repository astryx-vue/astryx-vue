<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'

async function saveChanges(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1200))
}
</script>

<template>
  <Button
    :click-action="saveChanges"
    label="Save changes"
    loading-label="Saving"
    variant="primary"
  />
</template>
