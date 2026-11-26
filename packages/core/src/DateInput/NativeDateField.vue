<script setup lang="ts">
import type { HTMLAttributes, StyleValue } from 'vue'
import type { DateInputProps } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { toCalendarDate } from '../Calendar/calendarDate.js'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { dateInputMessages } from '../locale/messages/date-input.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { dateEntryMessage } from './dateEntry.js'
import { formatCommittedDate, resolveDateStatus, toIsoDate } from './dateText.js'
import '../../styles/date-input.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Pick<DateInputProps, 'id' | 'modelValue' | 'label' | 'description' | 'placeholder' | 'min' | 'max' | 'isDateDisabled' | 'dateConstraints'
  | 'name' | 'isLabelHidden' | 'isOptional' | 'isRequired' | 'labelTooltip' | 'disabled' | 'disabledReason' | 'disabledMessage'
  | 'isLoading' | 'changeAction' | 'hasClear' | 'clearable' | 'clearLabel' | 'size' | 'status' | 'statusVariant' | 'format'
  | 'describedBy' | 'width'> & {
    inputId: string
    containerClass?: HTMLAttributes['class']
    containerStyle?: StyleValue
    controlClass?: HTMLAttributes['class']
    controlStyle?: StyleValue
    /** 调用方监听了 `entryErrorChange`：它带说明的 error 状态替被拒的日子措辞。 */
    hasEntryErrorListener?: boolean
  }>(), {
  modelValue: null,
  disabled: false,
  clearable: false,
  size: 'md',
  statusVariant: 'attached',
  format: 'date_long',
  isLoading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
}>()

const attrs = useAttrs()
const ariaRequired = useAriaRequired(props)
const messages = useComponentMessages({ dateInput: dateInputMessages })
const locale = useAstryxLocale()
const inputRef = useTemplateRef<HTMLInputElement>('input')
const containerRef = useTemplateRef<HTMLDivElement>('container')
const focused = ref(false)
/** 系统控件报上来、字段不收的日子，等 Enter 或失焦再亮出来。 */
const heldRefusal = ref<Date | null>(null)
/** Enter 或失焦亮出来的被拒日子。控件恢复成已提交的值后仍然亮着，直到报来能收的日子或清空。 */
const shownRefusal = ref<Date | null>(null)
let isRevealing = false
const pending = usePendingChange(() => props.changeAction)
const busy = computed(() => props.isLoading || pending.busy.value)
const locked = computed(() => props.disabled || busy.value)
const disabledMessage = computed(() => (props.disabledMessage?.trim() || props.disabledReason?.trim()) || undefined)
const disabledMessageId = `${props.inputId}-disabled`
const showsDisabledMessage = computed(() => locked.value && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const showsClear = computed(() => (props.hasClear || props.clearable) && Boolean(props.modelValue) && !locked.value)

useBusyAnnouncement(busy, () => messages.value.dateInput.loading, () => containerRef.value)

function allowed(date: Date): boolean {
  return !isCalendarDateDisabled(toCalendarDate(date), {
    min: props.min,
    max: props.max,
    isDateDisabled: props.isDateDisabled,
    dateConstraints: props.dateConstraints,
  })
}

const nativeValue = computed(() => props.modelValue ? toIsoDate(props.modelValue) : '')
const overlay = computed(() => props.modelValue
  ? formatCommittedDate(props.modelValue, props.format, locale.value)
  : props.placeholder ?? messages.value.dateInput.placeholder)
const refusalMessage = computed(() => !locked.value && shownRefusal.value
  ? dateEntryMessage({ kind: 'outOfRange', date: shownRefusal.value, isComplete: true }, { min: props.min, max: props.max }, props.format, locale.value, messages.value.dateInput)
  : null)
const callerError = computed(() => {
  const status = resolveDateStatus(props.status)
  return props.hasEntryErrorListener && status?.type === 'error' && status.message ? status.message : null
})
const statusValue = computed(() => refusalMessage.value != null && callerError.value == null
  ? { type: 'error' as const, message: refusalMessage.value }
  : resolveDateStatus(props.status))
const statusType = computed(() => statusValue.value?.type)
// 拒绝开始时调用方的 error 说明没变，状态不变就没人念，由 alert 念一次。
const repeat = ref<string | null>(null)
watch(() => refusalMessage.value != null, (rejected) => {
  repeat.value = rejected ? callerError.value : null
})
watch(callerError, (next) => {
  if (repeat.value !== null && repeat.value !== next)
    repeat.value = null
})
const alertMessage = computed(() => refusalMessage.value != null && repeat.value != null && repeat.value === callerError.value ? repeat.value : '')
const minIso = computed(() => props.min ? toIsoDate(props.min) : undefined)
const maxIso = computed(() => props.max ? toIsoDate(props.max) : undefined)

function write(value: string): void {
  const input = inputRef.value
  if (input && input.value !== value)
    input.value = value
}

function commit(value: Date | null): void {
  if (locked.value)
    return
  emit('update:modelValue', value)
  emit('change', value)
  void pending.run(value)
}

function read(raw: string): void {
  if (locked.value)
    return
  if (!raw) {
    heldRefusal.value = null
    shownRefusal.value = null
    if (props.modelValue)
      commit(null)
    return
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!match)
    return
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  // 敲年份时控件会把每个半截年份都报成日子，所以被拒的日子先压着，Enter 或失焦再亮。
  if (!allowed(date)) {
    heldRefusal.value = date
    return
  }
  heldRefusal.value = null
  shownRefusal.value = null
  if (!props.modelValue || toIsoDate(props.modelValue) !== raw)
    commit(date)
}

function onNative(): void {
  read(inputRef.value?.value ?? '')
}

function onFocus(): void {
  focused.value = true
}

/** Enter 或失焦：亮出压着的被拒日子。 */
function revealRefusal(): void {
  if (locked.value || heldRefusal.value == null)
    return
  shownRefusal.value = heldRefusal.value
  heldRefusal.value = null
  isRevealing = true
  void nextTick(() => {
    isRevealing = false
  })
}

function onBlur(): void {
  focused.value = false
  read(inputRef.value?.value ?? '')
  revealRefusal()
  write(nativeValue.value)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter')
    revealRefusal()
}

function onInputFocus(event: FocusEvent): void {
  onFocus()
  disabledTooltip.onFocus(event)
}

function onInputBlur(): void {
  disabledTooltip.onBlur()
  onBlur()
}

function openPicker(): void {
  if (locked.value)
    return
  const input = inputRef.value
  if (!input)
    return
  input.focus()
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    }
    catch {
      // Some browsers throw without a user gesture. Focus still opens the control.
    }
  }
}

function onClear(event: Event): void {
  event.stopPropagation()
  commit(null)
  write('')
}

onMounted(() => {
  write(nativeValue.value)
  const input = inputRef.value
  input?.addEventListener('input', onNative)
  input?.addEventListener('change', onNative)
})

onBeforeUnmount(() => {
  const input = inputRef.value
  input?.removeEventListener('input', onNative)
  input?.removeEventListener('change', onNative)
})

watch(nativeValue, (value) => {
  // 外面传来的新值结束拒绝；亮出拒绝的那一刻传进来的不算，调用方可以在那里恢复自己的值。
  if (!isRevealing) {
    heldRefusal.value = null
    shownRefusal.value = null
  }
  if (!focused.value)
    write(value)
})
</script>

<template>
  <Field
    :class="containerClass"
    :style="containerStyle"
    :label="label || messages.dateInput.dialogLabel"
    :input-id="inputId"
    :description="description"
    :width="width"
    :is-label-hidden="isLabelHidden || !label"
    :is-disabled="locked"
    :is-optional="isOptional"
    :is-required="isRequired"
    :label-tooltip="labelTooltip"
    :status="statusValue"
    :status-variant="statusVariant"
  >
    <template #default="field">
      <div
        ref="containerRef"
        class="astryx-date-input"
        :class="[statusType ? `status-${statusType}` : undefined, `size-${size}`, controlClass]"
        :style="controlStyle"
        :data-status="statusType"
        data-presentation="native"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <div
          class="astryx-date-input-wrapper"
          :data-disabled="disabled ? 'true' : undefined"
          :data-busy="busy || undefined"
          :data-size="size"
          :data-status="statusType"
        >
          <button
            type="button"
            class="astryx-date-input-toggle"
            :aria-disabled="locked || undefined"
            :aria-describedby="showsDisabledMessage ? disabledMessageId : undefined"
            :aria-label="messages.dateInput.openCalendar"
            tabindex="-1"
            @click="openPicker"
          >
            <Icon icon="calendar" size="sm" />
          </button>
          <span class="astryx-date-input-native">
            <input
              v-bind="attrs"
              :id="inputId"
              ref="input"
              class="astryx-date-input-field"
              type="date"
              :min="minIso"
              :max="maxIso"
              :readonly="locked || undefined"
              :name="name"
              :aria-label="label ? undefined : messages.dateInput.dialogLabel"
              :aria-labelledby="label ? field.labelId : undefined"
              :aria-describedby="[describedBy, field.describedBy, showsDisabledMessage ? disabledMessageId : undefined].filter(Boolean).join(' ') || undefined"
              :aria-disabled="locked || undefined"
              :aria-invalid="statusType === 'error' ? 'true' : undefined"
              :aria-required="ariaRequired"
              :aria-busy="busy || undefined"
              autocomplete="off"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @keydown="onKeydown"
            >
            <span class="astryx-date-input-overlay" :data-placeholder="modelValue ? undefined : 'true'" aria-hidden="true">
              {{ overlay }}
            </span>
          </span>
          <button
            v-if="showsClear"
            type="button"
            class="astryx-date-input-clear"
            :aria-label="clearLabel || messages.dateInput.clear(label)"
            tabindex="-1"
            @click="onClear"
          >
            <Icon icon="close" size="sm" />
          </button>
          <Spinner v-if="busy" size="sm" aria-hidden="true" />
          <FieldIcon v-else-if="statusType && statusVariant !== 'tooltip'" :type="statusType" />
        </div>
        <div class="astryx-date-input-alert" role="alert">
          {{ alertMessage }}
        </div>
      </div>
    </template>
  </Field>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="`${disabledMessageId}-tooltip`" :anchor="containerRef" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
