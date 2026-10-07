<script setup lang="ts">
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'
import { computed, shallowRef } from 'vue'

const count = shallowRef(0)

const announcement = computed(() => {
  if (count.value === 0)
    return ''

  return count.value === 1 ? '1 item added' : `${count.value} items added`
})

function increment(): void {
  count.value += 1
}
</script>

<template>
  <div class="visually-hidden-preview__controls">
    <button
      class="visually-hidden-preview__button"
      type="button"
      @click="increment"
    >
      Add item
    </button>
    <span>Items added: {{ count }}</span>
  </div>
  <VisuallyHidden as="div" aria-live="polite" role="status">
    {{ announcement }}
  </VisuallyHidden>
  <div aria-hidden="true" class="visually-hidden-preview__announcement">
    <span class="visually-hidden-preview__label">Screen reader</span>
    <q>{{ announcement || 'Waiting for an update' }}</q>
  </div>
</template>
