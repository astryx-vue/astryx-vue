<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useKeyboardHint, useListFocus } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const STARS = [1, 2, 3, 4, 5]

const rating = ref(0)
// Left and Right move the rating, so the hint shows ← →.
const hint = useKeyboardHint({ orientation: 'horizontal' })
// Moves focus between the stars, right-to-left aware and stopping at the
// ends; the tab stop stays with the checked star below.
const list = useListFocus({
  itemSelector: '[role="radio"]',
  orientation: 'horizontal',
  wrap: false,
  hasHomeEnd: false,
})

function bindList(el: Element | ComponentPublicInstance | null): void {
  const node = el != null && '$el' in el ? el.$el : el
  list.listRef.value = node instanceof HTMLElement ? node : null
}

function onKeyDown(event: KeyboardEvent): void {
  // Dismisses the hint on the first arrow press; never prevents the key.
  hint.onKeyDown(event)
  list.handleKeyDown(event)
  // The hook prevents the arrows it handled, so the rating follows focus.
  if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.defaultPrevented)
    rating.value = list.getItems().indexOf(document.activeElement as HTMLElement) + 1
}
</script>

<template>
  <Card :padding="4">
    <HStack
      :ref="bindList"
      :gap="1"
      role="radiogroup"
      aria-label="Rating"
      @focusin="hint.onFocus"
      @focusout="hint.onBlur"
      @keydown="onKeyDown"
    >
      <Button
        v-for="star in STARS"
        :key="star"
        role="radio"
        :aria-checked="star === rating"
        :tabindex="star === Math.max(rating, 1) ? 0 : -1"
        :label="star === 1 ? '1 star' : `${star} stars`"
        variant="ghost"
        is-icon-only
        @click="rating = star"
      >
        <template #icon>
          <Icon :icon="star <= rating ? 'i-heroicons-star-solid' : 'i-heroicons-star'" />
        </template>
      </Button>
      <component :is="hint.Hint" />
    </HStack>
  </Card>
</template>
