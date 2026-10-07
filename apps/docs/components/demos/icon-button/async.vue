<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'

async function save(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1200))
}
</script>

<template>
  <IconButton :click-action="save" label="Copy">
    <span class="i-carbon-copy" />
  </IconButton>
</template>
