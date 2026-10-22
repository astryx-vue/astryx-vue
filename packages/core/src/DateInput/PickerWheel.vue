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

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Home' && event.key !== 'End')
    return
  event.preventDefault()
  const options = enabled()
  if (options.length === 0)
    return
  const current = options.findIndex(option => option.value === props.modelValue)
  let next = 0
  if (event.key === 'End') {
    next = options.length - 1
  }
  else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const step = event.key === 'ArrowDown' ? 1 : -1
    next = current < 0 ? (step > 0 ? 0 : options.length - 1) : (current + step + options.length) % options.length
  }
  const option = options[next]
  if (option)
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
