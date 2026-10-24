<script setup lang="ts">
import type { ClickableCardEmits, ClickableCardProps, ClickableCardSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import Card from '../Card/Card.vue'
import { useClickableContainer } from '../composables/useClickableContainer.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/clickable-card.css'

defineOptions({ name: 'AstryxClickableCard' })

const props = withDefaults(defineProps<ClickableCardProps>(), {
  elevation: 'none',
  isDisabled: false,
  variant: 'default',
})

const emit = defineEmits<ClickableCardEmits>()
defineSlots<ClickableCardSlots>()

const cardRef = useTemplateRef<{ element: HTMLElement | null }>('card')
const interactiveRef = useTemplateRef<{ element: HTMLElement | null }>('interactive')
const containerRef = computed(() => cardRef.value?.element ?? null)
const controlRef = computed(() => interactiveRef.value?.element ?? null)

const { pressableProps } = usePressFeedback({ hasOverlay: false })

const handlers = useClickableContainer({
  containerRef,
  interactiveRef: controlRef,
  get disabled() {
    return props.isDisabled
  },
  get href() {
    return props.href
  },
  get target() {
    return props.target
  },
  onClick(event) {
    emit('click', event)
  },
})

function onSurfaceClick(event: MouseEvent): void {
  if (props.isDisabled)
    return
  handlers.onClick(event)
}

function onSurfaceMouseUp(event: MouseEvent): void {
  if (props.isDisabled)
    return
  handlers.onMouseUp(event)
}
</script>

<template>
  <Card
    ref="card"
    class="astryx-clickable-card"
    :data-disabled="isDisabled || undefined"
    :elevation="elevation"
    :height="height"
    :max-width="maxWidth"
    :padding="padding"
    :variant="variant"
    :width="width"
    v-bind="isDisabled ? undefined : pressableProps"
    @click="onSurfaceClick"
    @mouseup="onSurfaceMouseUp"
  >
    <VisuallyHidden
      v-if="href"
      ref="interactive"
      as="a"
      :aria-disabled="isDisabled || undefined"
      :aria-label="label"
      :href="isDisabled ? undefined : href"
      :tabindex="isDisabled ? -1 : undefined"
      :target="target"
    />
    <VisuallyHidden
      v-else
      ref="interactive"
      as="button"
      :aria-label="label"
      :disabled="isDisabled"
      type="button"
      @click="emit('click', $event)"
    />
    <slot />
  </Card>
</template>
