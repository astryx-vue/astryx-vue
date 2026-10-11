<script setup lang="ts">
import type { NumberInputEmits, NumberInputProps } from './types.js'
import { computed, ref, useId } from 'vue'
import { useNumberField } from '../composables/useNumberField.js'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/number-input.css'

defineOptions({ name: 'AstryxNumberInput' })

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  placeholder: '',
  step: 1,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<NumberInputEmits>()

const inputId = `astryx-number-input-${useId()}`
const messages = useAstryxMessages()
const incrementLabel = computed(() => messages.value.numberInput.increment(props.label))
const decrementLabel = computed(() => messages.value.numberInput.decrement(props.label))
const inputValue = ref('')

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const numberField = useNumberField({
  value: modelValueRef,
  min: props.min,
  max: props.max,
  step: props.step,
  disabled: computed(() => props.disabled),
  onChange: (value) => {
    modelValueRef.value = value
    inputValue.value = value === null ? '' : String(value)
  },
})

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()

  if (value === '') {
    numberField.setValue(null)
    return
  }

  const parsed = Number.parseFloat(value)
  if (!Number.isNaN(parsed)) {
    numberField.setValue(parsed)
  }
  else {
    // 恢复到上一个有效值
    target.value = inputValue.value
  }
}

function onKeyDown(event: KeyboardEvent): void {
  numberField.onKeyDown(event)
}

// 同步显示值
function syncDisplayValue(): void {
  inputValue.value = props.modelValue === null ? '' : String(props.modelValue)
}

syncDisplayValue()
</script>

<template>
  <div class="astryx-number-input" :class="`size-${props.size}`">
    <input
      :id="inputId"
      type="text"
      inputmode="decimal"
      class="astryx-number-input-field"
      :value="inputValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :aria-label="props.label"
      :title="props.disabledReason"
      @input="onInput"
      @keydown="onKeyDown"
    >
    <div class="astryx-number-input-buttons">
      <button
        type="button"
        class="astryx-number-input-button increment"
        :disabled="props.disabled"
        :aria-label="incrementLabel"
        tabindex="-1"
        @click="numberField.increment"
      >
        <svg class="astryx-number-input-chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" fill="none">
          <path d="M1.5 1.75 6 6.25 10.5 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="astryx-number-input-button decrement"
        :disabled="props.disabled"
        :aria-label="decrementLabel"
        tabindex="-1"
        @click="numberField.decrement"
      >
        <svg class="astryx-number-input-chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" fill="none">
          <path d="M1.5 1.75 6 6.25 10.5 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :value="props.modelValue ?? ''"
    >
  </div>
</template>
