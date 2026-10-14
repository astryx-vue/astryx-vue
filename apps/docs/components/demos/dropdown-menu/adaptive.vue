<script setup lang="ts">
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)

function run(action: string) {
  lastAction.value = action
}

const actions = [
  { label: 'Edit project', icon: 'css-icon css-icon--sm i-carbon-edit' },
  { label: 'Duplicate project', icon: 'css-icon css-icon--sm i-carbon-copy' },
  { label: 'Share project', icon: 'css-icon css-icon--sm i-carbon-share' },
  { label: 'Archive project', icon: 'css-icon css-icon--sm i-carbon-archive' },
].map(action => ({
  label: action.label,
  icon: action.icon,
  onClick: () => run(action.label),
}))
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu
      :button="{ label: 'Project actions' }"
      presentation="adaptive"
      :items="actions"
    />
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
