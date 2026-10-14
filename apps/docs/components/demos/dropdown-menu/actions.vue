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
      :button="{ label: 'Actions' }"
      :items="[
        { label: 'Edit', onClick: () => run('Edit') },
        { label: 'Duplicate', onClick: () => run('Duplicate') },
        { label: 'Move to folder', onClick: () => run('Move') },
        { type: 'divider' },
        { label: 'Archive', onClick: () => run('Archive') },
        { label: 'Delete', onClick: () => run('Delete') },
      ]"
    />
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
