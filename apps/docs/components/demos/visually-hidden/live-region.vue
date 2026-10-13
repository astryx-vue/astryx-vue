<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'
import { computed, shallowRef } from 'vue'

const columns = ['Backlog', 'In progress', 'Done'] as const
const column = shallowRef(0)
const current = computed(() => columns[column.value])

function move(): void {
  column.value = (column.value + 1) % columns.length
}
</script>

<template>
  <VStack :gap="4" h-align="start">
    <Text type="supporting" color="secondary">
      Drag-and-drop and other visual-only changes are silent to screen readers. A live region narrates them.
    </Text>
    <HStack :gap="3" align="center">
      <Button label="Move task" variant="secondary" @click="move" />
      <Text type="body">
        Task is in <Text as="span" weight="bold">
          {{ current }}
        </Text>
      </Text>
    </HStack>
    <VisuallyHidden as="div" aria-live="polite">
      Task moved to {{ current }}
    </VisuallyHidden>
  </VStack>
</template>
