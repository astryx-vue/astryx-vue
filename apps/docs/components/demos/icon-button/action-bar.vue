<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <HStack :gap="1">
    <IconButton label="Search" variant="ghost" @click="demo('Search')">
      <Icon icon="i-heroicons-magnifying-glass" color="inherit" />
    </IconButton>
    <IconButton label="Copy" variant="ghost" @click="demo('Copy')">
      <Icon icon="i-heroicons-document-duplicate" color="inherit" />
    </IconButton>
    <IconButton label="Info" variant="ghost" @click="demo('Info')">
      <Icon icon="i-heroicons-information-circle" color="inherit" />
    </IconButton>
    <IconButton label="Menu" variant="ghost" @click="demo('Menu')">
      <Icon icon="i-heroicons-bars-3" color="inherit" />
    </IconButton>
    <IconButton label="Close" variant="ghost" @click="demo('Close')">
      <Icon icon="i-heroicons-x-mark" color="inherit" />
    </IconButton>
  </HStack>
</template>
