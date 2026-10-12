<script setup lang="ts">
import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TimeInputSize } from './types.js'
import { computed, shallowRef, watch } from 'vue'
import { useCoarsePointer } from '../composables/useCoarsePointer.js'
import { formatDisplayTime, isTimeInRange, parseDisplayTime, resolveTimeSurface, shiftTime } from '../composables/useTimeValue.js'
import FieldIcon from '../Field/FieldIcon.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/bordered-control.css'
import '../../styles/time-input.css'

defineOptions({ name: 'AstryxTimeField', inheritAttrs: false })

const props = withDefaults(defineProps<{
  label?: string
  inputId?: string
  describedBy?: string
  labelledBy?: string
  placeholder?: string
  hourFormat?: HourFormat
  hasSeconds?: boolean
  increment?: number
  min?: string
  max?: string
  presentation?: TimePresentation
  nativePicker?: NativePicker
  hasClear?: boolean
  clearLabel?: string
  size?: TimeInputSize
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  status?: FieldStatusInput
}>(), {
  hourFormat: '12h',
  hasSeconds: false,
  increment: 1,
  size: 'md',
  hasClear: false,
})

const model = defineModel<string | null>({ default: null })
const messages = useAstryxMessages()
const coarse = useCoarsePointer()
const focused = shallowRef(false)
const draft = shallowRef('')

const surface = computed(() => resolveTimeSurface({
  presentation: props.presentation,
  nativePicker: props.nativePicker,
  coarse: coarse.value,
  hasSeconds: props.hasSeconds,
  increment: props.increment,
}))

const clearLabel = computed(() => props.clearLabel ?? messages.value.timeInput.clear(props.label))
const formatHint = computed(() => props.hourFormat === '24h' || props.hasSeconds
  ? messages.value.timeInput.formatHint24
  : messages.value.timeInput.formatHint12)

watch(() => model.value, (value) => {
  if (!focused.value)
    draft.value = value ? formatDisplayTime(value, props.hourFormat, props.hasSeconds) : ''
}, { immediate: true })

const shownPlaceholder = computed(() => {
  if (focused.value && !draft.value)
    return formatHint.value
  return props.placeholder ?? messages.value.timeInput.placeholder
})

function commit(value: string | null): void {
  model.value = value
  draft.value = value ? formatDisplayTime(value, props.hourFormat, props.hasSeconds) : ''
}

function commitText(text: string): void {
  if (!text.trim()) {
    commit(null)
    return
  }
  const parsed = parseDisplayTime(text, props.hasSeconds)
  if (parsed == null || !isTimeInRange(parsed, props.min, props.max)) {
    draft.value = model.value ? formatDisplayTime(model.value, props.hourFormat, props.hasSeconds) : ''
    return
  }
  commit(parsed)
}

function onInput(event: Event): void {
  draft.value = (event.target as HTMLInputElement).value
}

function onNativeInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (!value) {
    commit(null)
    return
  }
  const parsed = parseDisplayTime(value, props.hasSeconds)
  if (parsed == null || !isTimeInRange(parsed, props.min, props.max))
    return
  commit(parsed)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.isDisabled || props.isReadOnly)
    return
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
    return
  event.preventDefault()
  const delta = event.key === 'ArrowUp' ? props.increment : -props.increment
  const next = shiftTime(model.value || '00:00', delta, props.hasSeconds)
  if (isTimeInRange(next, props.min, props.max))
    commit(next)
}

function onBlur(): void {
  focused.value = false
  if (surface.value === 'text')
    commitText(draft.value)
}

function clear(): void {
  if (props.isDisabled || props.isReadOnly)
    return
  commit(null)
}
</script>

<template>
  <div
    class="astryx-time-input astryx-bordered-control"
    :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined"
  >
    <Icon class="astryx-time-input-icon" icon="clock" size="sm" />
    <input
      v-if="surface === 'native'"
      :id="inputId" class="astryx-time-input-control" type="time"
      :value="model ?? ''" :min="min" :max="max" :step="hasSeconds ? 1 : increment * 60"
      :disabled="isDisabled" :readonly="isReadOnly"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="describedBy" :aria-required="isRequired || undefined"
      :aria-invalid="status?.type === 'error' || undefined"
      @input="onNativeInput"
    >
    <input
      v-else
      :id="inputId" class="astryx-time-input-control" type="text" inputmode="text" autocomplete="off"
      :value="draft" :placeholder="shownPlaceholder"
      :disabled="isDisabled" :readonly="isReadOnly"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="describedBy" :aria-required="isRequired || undefined"
      :aria-invalid="status?.type === 'error' || undefined"
      @input="onInput" @focus="focused = true" @blur="onBlur" @keydown="onKeydown"
    >
    <IconButton v-if="hasClear && model && !isDisabled && !isReadOnly" class="astryx-input-clear-button" variant="ghost" size="sm" :label="clearLabel" @click="clear">
      <FieldIcon type="clear" />
    </IconButton>
    <FieldIcon v-if="status" :type="status.type" />
  </div>
</template>
