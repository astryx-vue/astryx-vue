<script setup lang="ts">
import type { DateInputEmits, DateInputProps, DateInputSlots } from './types.js'
import { computed, ref, useId, useTemplateRef, watch } from 'vue'
import Calendar from '../Calendar/Calendar.vue'
import Popover from '../Popover/Popover.vue'
import '../../styles/date-input.css'

defineOptions({ name: 'AstryxDateInput' })

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: null,
  placeholder: '选择日期',
  disabled: false,
  clearable: false,
  clearLabel: '清除',
  size: 'md',
  status: 'default',
})

const emit = defineEmits<DateInputEmits>()
defineSlots<DateInputSlots>()

const inputId = `astryx-date-input-${useId()}`
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const isOpen = ref(false)
const inputValue = ref('')

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

// 格式化日期为字符串
function formatDate(date: Date | null): string {
  if (!date)
    return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 解析字符串为日期
function parseDate(str: string): Date | null {
  if (!str.trim())
    return null

  // 尝试解析 YYYY-MM-DD 格式
  const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!Number.isNaN(date.getTime())) {
      return date
    }
  }

  return null
}

// 同步显示值
function syncDisplayValue(): void {
  inputValue.value = formatDate(props.modelValue)
}

watch(() => props.modelValue, syncDisplayValue, { immediate: true })

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  inputValue.value = value

  const parsed = parseDate(value)
  if (parsed) {
    modelValueRef.value = parsed
  }
}

function onOpenChange(open: boolean): void {
  isOpen.value = open
}

function openCalendar(): void {
  if (!props.disabled)
    isOpen.value = true
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (props.disabled || isOpen.value)
    return
  if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault()
    openCalendar()
  }
}

function onCalendarChange(date: Date | null): void {
  modelValueRef.value = date
  isOpen.value = false
  inputRef.value?.blur()
}

function onClear(event: Event): void {
  event.stopPropagation()
  modelValueRef.value = null
  inputValue.value = ''
  isOpen.value = false
}

syncDisplayValue()
</script>

<template>
  <div class="astryx-date-input" :class="[`size-${props.size}`, `status-${props.status}`]">
    <Popover
      :is-open="isOpen"
      :is-enabled="!props.disabled"
      placement="below"
      alignment="start"
      :padding="0"
      :width="248"
      :has-close-button="false"
      :is-modal="false"
      :has-auto-focus="true"
      role="dialog"
      :label="props.label || '选择日期'"
      @open-change="onOpenChange"
    >
      <div class="astryx-date-input-wrapper" :data-disabled="props.disabled ? 'true' : undefined" :data-size="props.size">
        <span v-if="$slots.prefix" class="astryx-date-input-prefix">
          <slot name="prefix" />
        </span>
        <button
          type="button"
          class="astryx-date-input-toggle"
          :disabled="props.disabled"
          :aria-label="isOpen ? '关闭日历' : '打开日历'"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" stroke-width="1.5" />
            <path d="M3 6H13" stroke="currentColor" stroke-width="1.5" />
            <path d="M5 3V5M11 3V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <input
          :id="inputId"
          ref="inputRef"
          type="text"
          class="astryx-date-input-field"
          role="combobox"
          :value="inputValue"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :aria-label="props.label"
          :aria-expanded="isOpen"
          aria-haspopup="dialog"
          :title="props.disabledReason"
          autocomplete="off"
          @input="onInput"
          @click="openCalendar"
          @keydown="onInputKeyDown"
        >
        <button
          v-if="props.clearable && props.modelValue"
          type="button"
          class="astryx-date-input-clear"
          :aria-label="props.clearLabel"
          tabindex="-1"
          @click="onClear"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <span v-else-if="$slots.suffix" class="astryx-date-input-suffix">
          <slot name="suffix" />
        </span>
      </div>
      <template #content>
        <Calendar
          :model-value="props.modelValue"
          :min="props.min"
          :max="props.max"
          :is-date-disabled="props.isDateDisabled"
          @update:model-value="onCalendarChange"
        />
      </template>
    </Popover>

    <!-- 隐藏的原生 input（用于表单提交） -->
    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :value="formatDate(props.modelValue)"
    >
  </div>
</template>
