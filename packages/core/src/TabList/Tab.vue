<script setup lang="ts">
import type { TabProps } from './types.js'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

import { tabListContextKey } from './context.js'

const props = withDefaults(defineProps<TabProps>(), {
  disabled: false,
})

const context = inject(tabListContextKey)
const rootRef = ref<HTMLElement>()

const isSelected = computed(() => context?.value.value === props.value)
const tabIndex = computed(() => (isSelected.value && !props.disabled ? 0 : -1))

const classes = computed(() => [
  'astryx-tab',
  `astryx-tab--size-${context?.size.value ?? 'md'}`,
  isSelected.value && 'astryx-tab--selected',
  props.disabled && 'astryx-tab--disabled',
])

function handleClick() {
  if (props.disabled || !context)
    return
  context.selectTab(props.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled || !context)
    return

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      context.moveFocus('next', props.value)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      context.moveFocus('prev', props.value)
      break
    case 'Home':
      event.preventDefault()
      context.moveFocus('first', props.value)
      break
    case 'End':
      event.preventDefault()
      context.moveFocus('last', props.value)
      break
  }
}

onMounted(() => {
  if (!context || !rootRef.value)
    return
  context.registerTab({
    value: props.value,
    disabled: props.disabled,
    el: rootRef.value,
  })
})

onUnmounted(() => {
  context?.unregisterTab(props.value)
})

watch(() => props.disabled, (disabled) => {
  if (!context || !rootRef.value)
    return
  context.registerTab({
    value: props.value,
    disabled,
    el: rootRef.value,
  })
})
</script>

<template>
  <button
    :id="`astryx-tab-${value}`"
    ref="rootRef"
    type="button"
    role="tab"
    :class="classes"
    :aria-selected="isSelected"
    :aria-controls="panelId"
    :tabindex="tabIndex"
    :disabled="disabled"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span class="astryx-tab__label">
      <slot />
    </span>
  </button>
</template>
