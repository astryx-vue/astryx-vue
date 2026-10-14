<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="1">
    <IconButton label="Search" variant="ghost">
      <Icon icon="i-heroicons-magnifying-glass" color="inherit" />
    </IconButton>
    <IconButton label="Copy" variant="ghost">
      <Icon icon="i-heroicons-document-duplicate" color="inherit" />
    </IconButton>
    <IconButton label="Info" variant="ghost">
      <Icon icon="i-heroicons-information-circle" color="inherit" />
    </IconButton>
    <IconButton label="Menu" variant="ghost">
      <Icon icon="i-heroicons-bars-3" color="inherit" />
    </IconButton>
    <IconButton label="Close" variant="ghost">
      <Icon icon="i-heroicons-x-mark" color="inherit" />
    </IconButton>
  </HStack>
</template>
