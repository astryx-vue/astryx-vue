<script setup lang="ts">
import type { ScaleSpec } from './themeEditorModel'
import { fieldId, formatShown, parseScaleInput, stopValue } from './themeEditorModel'

/** 主题编辑面板里的一条阶梯：标题和说明、四个档位按钮、一个可以直接输入的数字框。 */
const props = defineProps<{
  spec: ScaleSpec
  value: number
}>()

const emit = defineEmits<{
  change: [value: number]
}>()

function onNumber(event: Event): void {
  const next = parseScaleInput(props.spec, (event.target as HTMLInputElement).value)
  if (next != null)
    emit('change', next)
}
</script>

<template>
  <div class="theme-editor__scale">
    <div class="theme-editor__scale-label">
      <span>{{ spec.label }}</span>
      <button type="button" class="theme-editor__info" :aria-label="spec.tooltip" :title="spec.tooltip">
        <span class="i-carbon-information" aria-hidden="true" />
      </button>
    </div>
    <div class="theme-editor__scale-row">
      <div class="theme-editor__stops" role="group" :aria-label="`${spec.control} preset`">
        <button
          v-for="stop in spec.stops"
          :key="stop.label"
          type="button"
          :aria-pressed="stopValue(spec, value) === stop.value"
          @click="emit('change', stop.value)"
        >
          {{ stop.label }}
        </button>
      </div>
      <label class="theme-editor__number" :for="fieldId(spec.key)">
        <span class="theme-editor__sr">{{ spec.control }}</span>
        <input
          :id="fieldId(spec.key)"
          :value="formatShown(spec, value)"
          inputmode="decimal"
          placeholder="—"
          @change="onNumber"
        >
        <span aria-hidden="true">{{ spec.units }}</span>
      </label>
    </div>
  </div>
</template>
