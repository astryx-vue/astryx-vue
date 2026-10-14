<script setup lang="ts">
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)

function run(action: string) {
  lastAction.value = action
}
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu
      :button="{ label: 'File', variant: 'ghost' }"
      :items="[
        {
          type: 'section',
          title: 'Create',
          items: [
            { label: 'New document', onClick: () => run('New document') },
            { label: 'New spreadsheet', onClick: () => run('New spreadsheet') },
            { label: 'New folder', onClick: () => run('New folder') },
          ],
        },
        {
          type: 'section',
          title: 'Manage',
          items: [
            { label: 'Share', onClick: () => run('Share') },
            { label: 'Move', onClick: () => run('Move') },
            { label: 'Archive', onClick: () => run('Archive') },
          ],
        },
      ]"
    />
    <Text v-if="lastAction" type="supporting" color="secondary">
      Selected: {{ lastAction }}
    </Text>
  </VStack>
</template>
