<script setup lang="ts">
import type { ToggleButtonGroupBaseProps, ToggleButtonGroupEmits, ToggleButtonGroupSlots, ToggleButtonGroupValue } from './types.js'
import { computed, provide } from 'vue'

import { toggleButtonGroupContextKey } from './context.js'
import '../../styles/toggle-button.css'

defineOptions({ name: 'AstryxToggleButtonGroup' })

const props = withDefaults(defineProps<ToggleButtonGroupBaseProps>(), {
  isDisabled: false,
  orientation: 'horizontal',
  size: 'md',
  type: 'single',
})

const emit = defineEmits<ToggleButtonGroupEmits>()
defineSlots<ToggleButtonGroupSlots>()

const value = defineModel<ToggleButtonGroupValue>('value', { default: null })

const isMultiple = computed(() => props.type === 'multiple')
const selectedValues = computed<Set<string>>(() => {
  const current = value.value

  if (isMultiple.value)
    return new Set(Array.isArray(current) ? current : [])

  return typeof current === 'string' ? new Set([current]) : new Set()
})

const size = computed(() => props.size)
const isDisabled = computed(() => props.isDisabled)

function toggle(member: string): void {
  const current = value.value

  if (isMultiple.value) {
    const members = Array.isArray(current) ? current : []
    const next = members.includes(member)
      ? members.filter(item => item !== member)
      : [...members, member]

    value.value = next
    emit('change', next)
    return
  }

  const next = current === member ? null : member
  value.value = next
  emit('change', next)
}

provide(toggleButtonGroupContextKey, {
  isDisabled,
  selectedValues,
  size,
  toggle,
})
</script>

<template>
  <div
    class="astryx-toggle-button-group"
    :aria-label="label"
    :data-orientation="orientation"
    :data-size="size"
    role="group"
  >
    <slot />
  </div>
</template>
