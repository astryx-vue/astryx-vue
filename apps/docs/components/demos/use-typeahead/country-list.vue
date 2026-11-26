<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useListFocus, useTypeahead } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const COUNTRIES = [
  'Belgium',
  'Brazil',
  'Bulgaria',
  'Canada',
  'Chile',
  'Denmark',
  'Éire',
  'Finland',
]

const country = ref<string | null>(null)
const { listRef, handleKeyDown, handleFocus, focusItem, getItems } = useListFocus({
  itemSelector: 'button',
  hasRovingTabIndex: true,
})
const typeahead = useTypeahead({
  getItemLabels: () => getItems().map(item => item.textContent),
  onMatch: focusItem,
  getCurrentIndex: () => getItems().findIndex(item => item === document.activeElement),
})

function bindList(el: Element | ComponentPublicInstance | null): void {
  const node = el != null && '$el' in el ? el.$el : el
  listRef.value = node instanceof HTMLElement ? node : null
}

function onFocusOut(event: FocusEvent): void {
  const group = event.currentTarget as HTMLElement
  if (!group.contains(event.relatedTarget as Node | null))
    typeahead.reset()
}

function onKeyDown(event: KeyboardEvent): void {
  if (typeahead.onKeyDown(event))
    event.preventDefault()
  else
    handleKeyDown(event)
}
</script>

<template>
  <VStack :gap="3" h-align="start">
    <VStack
      :ref="bindList"
      role="group"
      aria-label="Country"
      h-align="start"
      @focusin="handleFocus"
      @focusout="onFocusOut"
      @keydown="onKeyDown"
    >
      <Button
        v-for="name in COUNTRIES"
        :key="name"
        :label="name"
        variant="ghost"
        :aria-pressed="country === name"
        @click="country = name"
      />
    </VStack>
    <Text type="supporting">
      Selected: {{ country ?? 'none' }}
    </Text>
  </VStack>
</template>
