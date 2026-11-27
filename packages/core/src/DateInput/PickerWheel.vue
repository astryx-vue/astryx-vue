<script setup lang="ts">
import type { PickerWheelOption as WheelOption } from './wheelOptions'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import TouchPickerWheel from './TouchPickerWheel.vue'
import { steppedRow, wheelKeyOf } from './wheelOptions'

export type PickerWheelOption = WheelOption

const props = defineProps<{
  label: string
  options: readonly PickerWheelOption[]
  modelValue?: string
  /** Under a finger the rows repeat without end, as UIDatePicker's minutes do. The mouse column does not loop. */
  looping?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/** 主指针是手指时换成 UIPickerView 的滚轮；鼠标下保留可滚动的列。 */
const coarse = useMediaQuery('(pointer: coarse)')

function choose(value: string, disabled?: boolean): void {
  if (!disabled)
    emit('update:modelValue', value)
}

/**
 * 滚轮是 listbox：方向键走一行，Page 键走十行，Home / End 到头。
 * 只在可选的行之间走，走到头就停在头上，不绕回另一头。
 */
function onKeydown(event: KeyboardEvent): void {
  const key = wheelKeyOf(event.key)
  if (key == null)
    return
  event.preventDefault()
  const from = props.options.findIndex(option => option.value === props.modelValue)
  const row = steppedRow(props.options, from, key)
  const option = row == null ? undefined : props.options[row]
  if (option && option.value !== props.modelValue)
    emit('update:modelValue', option.value)
}
</script>

<template>
  <TouchPickerWheel
    v-if="coarse"
    :label="label"
    :options="options"
    :model-value="modelValue"
    :looping="looping"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <div
    v-else
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
