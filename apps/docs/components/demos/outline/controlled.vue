<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core/Outline'
import { Button } from '@astryx-vue/core/Button'
import { Outline } from '@astryx-vue/core/Outline'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const items: OutlineItem[] = [
  { id: 'ctrl-summary', label: 'Summary', level: 2 },
  { id: 'ctrl-details', label: 'Details', level: 2 },
  { id: 'ctrl-results', label: 'Results', level: 2 },
  { id: 'ctrl-next-steps', label: 'Next steps', level: 2 },
]

const activeId = ref('ctrl-details')
const index = computed(() => items.findIndex(item => item.id === activeId.value))

function goTo(next: number): void {
  const clamped = Math.max(0, Math.min(items.length - 1, next))
  activeId.value = items[clamped].id
}
</script>

<template>
  <VStack :gap="4" :width="240">
    <Outline v-model:active-id="activeId" :items="items" />
    <HStack :gap="2">
      <Button variant="secondary" size="sm" label="Previous" @click="goTo(index - 1)" />
      <Button variant="secondary" size="sm" label="Next" @click="goTo(index + 1)" />
    </HStack>
    <Text type="supporting" color="secondary">
      Active section: {{ items[index]?.label }}
    </Text>
  </VStack>
</template>
