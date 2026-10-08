<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref('Nothing yet')

function record(label: string): void {
  lastAction.value = label
}

const items: MoreMenuOption[] = [
  { label: 'Open in new tab', onClick: () => record('Open in new tab') },
  { label: 'Copy link', onClick: () => record('Copy link') },
  { label: 'Rename', onClick: () => record('Rename') },
  { type: 'divider' },
  { label: 'Move to trash', variant: 'destructive', onClick: () => record('Move to trash') },
]
</script>

<template>
  <div class="more-menu-preview__stack">
    <VStack h-align="start" :gap="3">
      <MoreMenu :items="items" label="More options" />
      <Text type="body" color="secondary">
        Last action: {{ lastAction }}
      </Text>
    </VStack>
  </div>
</template>
