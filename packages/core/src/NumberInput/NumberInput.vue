<script setup lang="ts">
import type { NumberInputEmits, NumberInputProps } from './types.js'
import { computed, ref, useId } from 'vue'
import { useNumberField } from '../composables/useNumberField.js'
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
const inputRef = ref<HTMLInputElement | null>(null)
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
      ref="inputRef"
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
        aria-label="增加"
        tabindex="-1"
        @click="numberField.increment"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 4V12M4 8H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <button
        type="button"
        class="astryx-number-input-button decrement"
        :disabled="props.disabled"
        aria-label="减少"
        tabindex="-1"
        @click="numberField.decrement"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 隐藏的原生 input（用于表单提交） -->
    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :value="props.modelValue ?? ''"
    >
  </div>
</template>
