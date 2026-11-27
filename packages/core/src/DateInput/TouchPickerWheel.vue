<script setup lang="ts">
/**
 * One UIPickerView column: the picker wheel under a coarse primary pointer.
 * A finger drags the rows, a flick coasts onto the row UIKit's projection
 * picks, a drag past either end rubber-bands, and a tap, a key or a value set
 * from outside turns the wheel on the settle spring. The rows lie flat at a
 * 28 px pitch and fade toward the column's edges.
 */
import type { PickerWheelOption, WheelKey } from './wheelOptions'
import { useId, useTemplateRef } from 'vue'
import { useTouchWheel } from './useTouchWheel'
import { wheelKeyOf } from './wheelOptions'
import { WHEEL_ROW_HEIGHT } from './wheelPhysics'

const props = defineProps<{
  label: string
  options: readonly PickerWheelOption[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = useId()
const column = useTemplateRef<HTMLElement>('column')
const strip = useTemplateRef<HTMLElement>('strip')
const wheel = useTouchWheel({
  column,
  strip,
  options: () => props.options,
  value: () => props.modelValue,
  onChange: value => emit('update:modelValue', value),
})
const { marked, selectedIndex } = wheel

function onKeydown(event: KeyboardEvent): void {
  const key: WheelKey | null = wheelKeyOf(event.key)
  if (key == null)
    return
  event.preventDefault()
  wheel.onKey(key)
}
</script>

<template>
  <div
    ref="column"
    class="astryx-picker-wheel-touch"
    role="listbox"
    tabindex="0"
    data-astryx-owns-pan=""
    :aria-label="label"
    :aria-activedescendant="options[selectedIndex] ? `${id}-${selectedIndex}` : undefined"
    @keydown="onKeydown"
  >
    <div class="astryx-picker-wheel-fade">
      <div class="astryx-picker-wheel-band" aria-hidden="true" />
      <div ref="strip" class="astryx-picker-wheel-strip">
        <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/interactive-supports-focus -- 选项不进 Tab 序，焦点留在滚轮上，方向键由滚轮处理；点击来自读屏或鼠标，手指的轻点由点按手势接管。 -->
        <div
          v-for="(option, index) in options"
          :id="`${id}-${index}`"
          :key="option.value"
          class="astryx-picker-wheel-row"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled || undefined"
          :data-marked="index === marked || undefined"
          :data-disabled="option.disabled || undefined"
          :style="{ insetBlockStart: `${index * WHEEL_ROW_HEIGHT}px` }"
          @click="wheel.activateRow(index)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>
