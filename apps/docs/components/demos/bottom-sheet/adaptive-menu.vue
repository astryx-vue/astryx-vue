<script setup lang="ts">
import { useMediaQuery } from '@astryx-vue/core'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const COMPACT_TOUCH_QUERY = '(max-width: 639px) and (pointer: coarse) and (hover: none)'
const isCompactTouch = useMediaQuery(COMPACT_TOUCH_QUERY)
const lastAction = ref<string | null>(null)

const items = computed(() => [
  'Edit project',
  'Duplicate project',
  'Share project',
  'Archive project',
].map(label => ({
  label,
  onClick: () => {
    lastAction.value = label
  },
})))
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu
      :button="{ label: 'Project actions' }"
      :items="items"
      :presentation="isCompactTouch ? 'bottom-sheet' : 'popover'"
    />
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
