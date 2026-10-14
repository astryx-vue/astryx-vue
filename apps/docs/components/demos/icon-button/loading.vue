<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const loadingId = ref<string | null>(null)

function handleClick(id: string) {
  loadingId.value = id
  setTimeout(() => {
    loadingId.value = null
  }, 1500)
}
</script>

<template>
  <HStack :gap="2">
    <IconButton label="Copy" variant="primary" :is-loading="loadingId === 'copy'" @click="handleClick('copy')">
      <Icon icon="i-heroicons-document-duplicate" color="inherit" />
    </IconButton>
    <IconButton label="Search" :is-loading="loadingId === 'search'" @click="handleClick('search')">
      <Icon icon="i-heroicons-magnifying-glass" color="inherit" />
    </IconButton>
    <IconButton label="Close" variant="ghost" :is-loading="loadingId === 'close'" @click="handleClick('close')">
      <Icon icon="i-heroicons-x-mark" color="inherit" />
    </IconButton>
  </HStack>
</template>
