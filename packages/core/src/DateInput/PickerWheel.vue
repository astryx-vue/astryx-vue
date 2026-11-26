<script setup lang="ts">
export interface PickerWheelOption {
  value: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  label: string
  options: readonly PickerWheelOption[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function enabled(): PickerWheelOption[] {
  return props.options.filter(option => !option.disabled)
}

function choose(value: string, disabled?: boolean): void {
  if (!disabled)
    emit('update:modelValue', value)
}

/** Page Up / Page Down 一次走的行数。 */
const PAGE_ROWS = 10

const STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  PageUp: -PAGE_ROWS,
  PageDown: PAGE_ROWS,
}

/**
 * 滚轮是 listbox：方向键走一行，Page 键走十行，Home / End 到头。
 * 只在可选的行之间走，走到头就停在头上，不绕回另一头。
 */
function onKeydown(event: KeyboardEvent): void {
  const step = STEPS[event.key]
  if (step == null && event.key !== 'Home' && event.key !== 'End')
    return
  event.preventDefault()
  const options = enabled()
  if (options.length === 0)
    return
  const last = options.length - 1
  const current = options.findIndex(option => option.value === props.modelValue)
  let next: number
  if (event.key === 'Home')
    next = 0
  else if (event.key === 'End')
    next = last
  else if (current < 0)
    next = (step ?? 0) > 0 ? 0 : last
  else
    next = Math.min(Math.max(current + (step ?? 0), 0), last)
  const option = options[next]
  if (option && option.value !== props.modelValue)
    emit('update:modelValue', option.value)
}
</script>

<template>
  <div
    class="astryx-picker-wheel"
    role="listbox"
    tabindex="0"
    :aria-label="label"
    :aria-activedescendant="modelValue ? `${label}-${modelValue}` : undefined"
    @keydown="onKeydown"
  >
    <button
      v-for="option in options"
      :id="`${label}-${option.value}`"
      :key="option.value"
      type="button"
      class="astryx-picker-wheel-option"
      role="option"
      :aria-selected="option.value === modelValue"
      :aria-disabled="option.disabled || undefined"
      :disabled="option.disabled"
      tabindex="-1"
      @click="choose(option.value, option.disabled)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
