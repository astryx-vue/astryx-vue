<script setup lang="ts">
import type { SelectableCardEmits, SelectableCardProps, SelectableCardSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import Card from '../Card/Card.vue'
import { useClickableContainer } from '../composables/useClickableContainer.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/clickable-card.css'

defineOptions({ name: 'AstryxSelectableCard' })

const props = withDefaults(defineProps<SelectableCardProps>(), {
  elevation: 'none',
  isDisabled: false,
  variant: 'default',
})

const emit = defineEmits<SelectableCardEmits>()
defineSlots<SelectableCardSlots>()

const isSelected = defineModel<boolean>('isSelected', { required: true })

const cardRef = useTemplateRef<{ element: HTMLElement | null }>('card')
const interactiveRef = useTemplateRef<{ element: HTMLElement | null }>('interactive')
const containerRef = computed(() => cardRef.value?.element ?? null)
const controlRef = computed(() => interactiveRef.value?.element ?? null)

function commit(next: boolean): void {
  isSelected.value = next
  emit('change', next)
}

const handlers = useClickableContainer({
  containerRef,
  interactiveRef: controlRef,
  get disabled() {
    return props.isDisabled
  },
  onClick() {
    commit(!isSelected.value)
  },
})

function onSurfaceClick(event: MouseEvent): void {
  if (props.isDisabled)
    return
  handlers.onClick(event)
}

const { pressableProps } = usePressFeedback({ hasOverlay: false })

function onKeyDown(event: KeyboardEvent): void {
  if (props.isDisabled) {
    if (event.key === ' ' || event.key === 'Enter')
      event.preventDefault()
    return
  }
  if (event.key !== 'Enter')
    return
  event.preventDefault()
  commit(!isSelected.value)
}
</script>

<template>
  <Card
    ref="card"
    class="astryx-clickable-card astryx-selectable-card"
    :data-disabled="isDisabled || undefined"
    :data-selected="isSelected || undefined"
    :elevation="elevation"
    :height="height"
    :max-width="maxWidth"
    :padding="padding"
    :variant="variant"
    :width="width"
    v-bind="isDisabled ? undefined : pressableProps"
    @click="onSurfaceClick"
  >
    <VisuallyHidden
      ref="interactive"
      as="input"
      :aria-disabled="isDisabled || undefined"
      :aria-label="label"
      :checked="isSelected"
      type="checkbox"
      @change="commit(($event.target as HTMLInputElement).checked)"
      @keydown="onKeyDown"
    />
    <slot />
  </Card>
</template>
