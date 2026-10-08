<script setup lang="ts">
import type { DividerProps } from './types.js'
import { computed, useAttrs, useId, useSlots } from 'vue'
import '../../styles/divider.css'

defineOptions({ name: 'AstryxDivider', inheritAttrs: false })
const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  variant: 'subtle',
  isFullBleed: false,
})
const attrs = useAttrs()
const slots = useSlots()
const labelId = `astryx-divider-label-${useId()}`

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'aria-labelledby')))
const labelledBy = computed(() => {
  const explicit = attrs['aria-labelledby'] as string | undefined
  if (explicit)
    return explicit
  return hasLabel.value && !attrs['aria-label'] ? labelId : undefined
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="astryx-divider"
    role="separator"
    :aria-orientation="orientation"
    :aria-labelledby="labelledBy"
    :data-orientation="orientation"
    :data-variant="variant"
    :data-full-bleed="isFullBleed || undefined"
  >
    <div class="astryx-divider__rule" />
    <div v-if="hasLabel" :id="labelId" class="astryx-divider__label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div v-if="hasLabel" class="astryx-divider__rule" />
  </div>
</template>
