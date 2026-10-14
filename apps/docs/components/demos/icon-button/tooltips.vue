<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="2">
    <IconButton label="Search" variant="ghost" tooltip="Search items">
      <Icon icon="i-heroicons-magnifying-glass" color="inherit" />
    </IconButton>
    <IconButton label="Copy link" variant="ghost" tooltip="Copy to clipboard">
      <Icon icon="i-heroicons-document-duplicate" color="inherit" />
    </IconButton>
    <IconButton label="More options" variant="ghost" tooltip="More options">
      <Icon icon="i-heroicons-ellipsis-horizontal" color="inherit" />
    </IconButton>
  </HStack>
</template>
