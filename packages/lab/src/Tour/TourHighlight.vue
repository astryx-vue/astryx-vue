<script setup lang="ts">
import type { TargetRect } from './types.js'
import { computed } from 'vue'

const props = defineProps<{
  rect: TargetRect | null
  hasBackdrop: boolean
}>()
const emit = defineEmits<{ backdropClick: [] }>()
function onBackdropPointerDown(event: PointerEvent): void {
  if (!props.hasBackdrop)
    return
  event.preventDefault()
  event.stopPropagation()
  emit('backdropClick')
}

const highlightStyle = computed(() => props.rect == null
  ? undefined
  : {
      top: `${props.rect.top - 4}px`,
      left: `${props.rect.left - 4}px`,
      width: `${props.rect.width + 8}px`,
      height: `${props.rect.height + 8}px`,
      borderRadius: props.rect.radius,
    })
</script>

<template>
  <div
    class="astryx-tour-highlight-root"
    :class="{ 'is-interactive': hasBackdrop }"
    :data-testid="hasBackdrop ? 'tour-backdrop' : undefined"
    aria-hidden="true"
    @pointerdown="onBackdropPointerDown"
  >
    <div
      class="astryx-tour-highlight"
      :class="{ 'has-backdrop': hasBackdrop, 'is-hidden': rect == null }"
      :style="highlightStyle"
      data-testid="tour-highlight"
    />
  </div>
</template>
