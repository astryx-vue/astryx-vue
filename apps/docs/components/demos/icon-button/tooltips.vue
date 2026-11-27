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
  <HStack :gap="2">
    <IconButton label="Search" variant="ghost" tooltip="Search items" @click="demo('Search')">
      <Icon icon="i-heroicons-magnifying-glass" color="inherit" />
    </IconButton>
    <IconButton label="Copy link" variant="ghost" tooltip="Copy to clipboard" @click="demo('Copy link')">
      <Icon icon="i-heroicons-document-duplicate" color="inherit" />
    </IconButton>
    <IconButton label="More options" variant="ghost" tooltip="More options" @click="demo('More options')">
      <Icon icon="i-heroicons-ellipsis-horizontal" color="inherit" />
    </IconButton>
  </HStack>
</template>
