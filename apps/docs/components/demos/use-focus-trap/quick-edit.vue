<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useFocusTrap } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { nextTick, ref, watch } from 'vue'

const isOpen = ref(false)
const title = ref('Update onboarding guide')
const draft = ref(title.value)

function close(): void {
  isOpen.value = false
}

const { containerRef, focusFirst } = useFocusTrap({
  isActive: isOpen,
  onEscape: close,
})

function bindPanel(el: Element | ComponentPublicInstance | null): void {
  const node = el != null && '$el' in el ? el.$el : el
  containerRef.value = node instanceof HTMLElement ? node : null
}

// Waits for the panel to mount; useFocusTrap has already recorded the opener,
// so closing the panel returns focus to it.
watch(isOpen, async (open) => {
  if (!open)
    return
  await nextTick()
  focusFirst()
})

function openPanel(): void {
  draft.value = title.value
  isOpen.value = true
}

function save(): void {
  title.value = draft.value
  close()
}
</script>

<template>
  <HStack :gap="4" align="start">
    <VStack :gap="2">
      <Text type="body" weight="bold">
        {{ title }}
      </Text>
      <Button label="Quick edit" @click="openPanel" />
    </VStack>
    <Card
      v-if="isOpen"
      :ref="bindPanel"
      role="dialog"
      aria-label="Quick edit"
      :width="280"
      :padding="4"
    >
      <VStack :gap="3">
        <TextInput v-model="draft" label="Title" />
        <HStack :gap="2" h-align="end">
          <Button label="Cancel" variant="secondary" @click="close" />
          <Button label="Save" variant="primary" @click="save" />
        </HStack>
      </VStack>
    </Card>
  </HStack>
</template>
