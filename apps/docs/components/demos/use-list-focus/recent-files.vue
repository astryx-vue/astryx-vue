<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useListFocus } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'

const RECENT_FILES = [
  'Q3 roadmap.pdf',
  'Budget 2026.xlsx',
  'Offsite notes.docx',
  'Launch checklist.md',
]

const { listRef, handleKeyDown, handleFocus } = useListFocus({
  itemSelector: 'button',
  orientation: 'vertical',
  wrap: true,
  hasHomeEnd: true,
  hasRovingTabIndex: true,
})

function bindList(el: Element | ComponentPublicInstance | null): void {
  const node = el != null && '$el' in el ? el.$el : el
  listRef.value = node instanceof HTMLElement ? node : null
}
</script>

<template>
  <Card :width="320" :padding="2">
    <VStack
      :ref="bindList"
      role="toolbar"
      aria-label="Recent files"
      aria-orientation="vertical"
      :gap="1"
      @keydown="handleKeyDown"
      @focusin="handleFocus"
    >
      <Button v-for="name in RECENT_FILES" :key="name" :label="name" variant="ghost" />
    </VStack>
  </Card>
</template>
