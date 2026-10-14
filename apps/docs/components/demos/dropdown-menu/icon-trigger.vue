<script setup lang="ts">
import { DropdownMenu, DropdownMenuDivider, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu>
      <template #trigger="triggerProps">
        <IconButton v-bind="triggerProps" label="More actions" variant="ghost">
          <Icon icon="moreHorizontal" />
        </IconButton>
      </template>
      <DropdownMenuItem label="Copy link" @click="lastAction = 'Copy link'" />
      <DropdownMenuItem label="Download" @click="lastAction = 'Download'" />
      <DropdownMenuItem label="Print" @click="lastAction = 'Print'" />
      <DropdownMenuDivider />
      <DropdownMenuItem label="Report" @click="lastAction = 'Report'" />
    </DropdownMenu>
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
