<script setup lang="ts">
import type { HTMLAttributes, StyleValue } from 'vue'
import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { TimeInputSize } from './types.js'
import type { TimeInputEntryError } from './useTypedTime.js'
import { computed, nextTick, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { formatDisplayTime, isTimeInRange, parseDisplayTime, resolveTimeSurface, shiftTime } from '../composables/useTimeValue.js'
import FieldIcon from '../Field/FieldIcon.vue'
import { useAriaRequired, useEntryErrorBehavior } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { dateInputMessages } from '../locale/messages/date-input.js'
import { timeInputMessages } from '../locale/messages/time-input.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Spinner from '../Spinner/Spinner.vue'
import { isImeKeyEvent } from '../utils/ime.js'
import { resolveHourFormat } from '../utils/timeFormat.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import TouchTimeWheels from './TouchTimeWheels.vue'
import { useTimePresetOptions } from './useTimePresetOptions.js'
import { useTypedTime } from './useTypedTime.js'
import '../../styles/bordered-control.css'
import '../../styles/date-input.css'
import '../../styles/time-input.css'
import '../../styles/layer.css'

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
  isLoading?: boolean
  loadingLabel?: string
  /** 预设时间的分钟间隔。传了它就会在时钟图标下弹出一个预设列表。 */
  optionInterval?: number
  /** 预设列表的无障碍名字。默认是「时间 + options」。 */
  optionsLabel?: string
  /** 为什么禁用。提示会关联到可聚焦的字段；禁用和忙碌时不能改值。 */
  disabledMessage?: string
  status?: FieldStatusInput
  /** 打字被拒什么时候亮出来。不传时用最近 FormLayout 的 `defaultEntryErrorBehavior`，再没有就是 `complete`。 */
  entryErrorBehavior?: EntryErrorBehavior
  controlClass?: HTMLAttributes['class']
  controlStyle?: StyleValue
}>(), {
  hasSeconds: false,
  increment: 1,
  size: 'md',
  hasClear: false,
})

const emit = defineEmits<{
  /** 字段对打进来的文字的拒绝开始、改变或结束，结束时参数是 `null`。 */
  entryErrorChange: [error: TimeInputEntryError | null]
  /** 亮着的拒绝那句话，没有拒绝时是 `null`。外壳用它写字段的错误状态。 */
  messageChange: [message: string | null]
}>()

const model = defineModel<string | null>({ default: null })
const attrs = useAttrs()
const ariaRequired = useAriaRequired(props)
const messages = useComponentMessages({ dateInput: dateInputMessages, timeInput: timeInputMessages })
const locale = useAstryxLocale()
const hourFormat = computed(() => resolveHourFormat(locale.value, props.hourFormat))
const entryErrorBehavior = useEntryErrorBehavior(() => props.entryErrorBehavior)
const sheetOpen = shallowRef(false)
const coarse = useMediaQuery('(pointer: coarse)')
const focused = shallowRef(false)
const container = useTemplateRef<HTMLDivElement>('container')
const optionsRef = useTemplateRef<HTMLDivElement>('options')
useScrollbars(optionsRef)
const generatedId = `astryx-time-field-${useId()}`
const listboxId = `${props.inputId ?? generatedId}-options`
const sheetId = `${props.inputId ?? generatedId}-sheet`
const disabledMessageId = `${props.inputId ?? generatedId}-disabled`
const busy = computed(() => props.isLoading === true)
const locked = computed(() => props.isDisabled || props.isReadOnly || busy.value)
const disabledMessage = computed(() => props.disabledMessage?.trim() || undefined)
const showsDisabledMessage = computed(() => (props.isDisabled || busy.value) && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)

const surface = computed(() => resolveTimeSurface({
  presentation: props.presentation,
  nativePicker: props.nativePicker,
  coarse: coarse.value,
  hasSeconds: props.hasSeconds,
  increment: props.increment,
  needsTypedField: props.optionInterval != null,
}))

const clearLabel = computed(() => props.clearLabel ?? messages.value.timeInput.clear(props.label))
const formatHint = computed(() => hourFormat.value === '24h' || props.hasSeconds
  ? messages.value.timeInput.formatHint24
  : messages.value.timeInput.formatHint12)

function formatCommitted(value: string): string {
  return formatDisplayTime(value, hourFormat.value, props.hasSeconds, locale.value)
}

const typed = useTypedTime({
  value: () => model.value,
  locale: () => locale.value,
  hourFormat: () => hourFormat.value,
  hasSeconds: () => props.hasSeconds,
  min: () => props.min,
  max: () => props.max,
  isLocked: () => locked.value,
  behavior: () => entryErrorBehavior.value,
  status: () => props.status,
  messages: () => messages.value.timeInput,
  commitValue: (value) => {
    model.value = value
  },
  formatCommitted,
  reportEntryError: error => emit('entryErrorChange', error),
})
const status = typed.fieldStatus
const draft = typed.displayValue

watch(typed.message, message => emit('messageChange', message), { immediate: true })
// 系统时间控件那一路被拒的编辑跟着控件走：换成打字的字段、或者字段被禁用，拒绝就结束。
watch(() => surface.value, () => typed.reset())
watch(() => props.isDisabled, (disabled) => {
  if (disabled)
    typed.reset()
})

useBusyAnnouncement(
  () => busy.value,
  () => props.loadingLabel ?? messages.value.timeInput.loading,
  () => (surface.value === 'sheet' && sheetOpen.value ? document.getElementById(sheetId) : null) ?? container.value,
)

const shownPlaceholder = computed(() => {
  if (focused.value && !draft.value)
    return formatHint.value
  return props.placeholder ?? messages.value.timeInput.placeholder
})

function commit(value: string | null): void {
  if (locked.value)
    return
  model.value = value
  typed.reset()
}

// 禁用态没有再走原生 `disabled`，输入和改值都靠这里的守卫挡住（spec:AST-085 FR2）。
function onInput(event: Event): void {
  typed.onInput((event.target as HTMLInputElement).value)
}

function onNativeInput(event: Event): void {
  if (locked.value)
    return
  const value = (event.target as HTMLInputElement).value
  if (!value) {
    commit(null)
    return
  }
  const parsed = parseDisplayTime(value, props.hasSeconds)
  if (parsed == null)
    return
  if (!isTimeInRange(parsed, props.min, props.max)) {
    typed.rejectNative({ text: value, time: parsed })
    return
  }
  commit(parsed)
}

/** 系统时间控件失焦时回到已提交的时间，被拒的那次编辑仍然亮着。 */
function onNativeBlur(event: FocusEvent): void {
  disabledTooltip.onBlur()
  const input = event.target
  if (input instanceof HTMLInputElement)
    input.value = model.value ?? ''
}

const {
  timeOptions,
  showsOptions,
  isOptionsOpen,
  activeOption,
  optionsStyle,
  openOptions,
  closeOptions,
  moveActive,
  selectOption,
} = useTimePresetOptions({
  interval: () => props.optionInterval,
  hasSeconds: () => props.hasSeconds,
  min: () => props.min,
  max: () => props.max,
  isLocked: () => locked.value,
  value: () => model.value,
  container,
  list: optionsRef,
  commit,
  focusInput,
})
const resolvedOptionsLabel = computed(() => props.optionsLabel ?? `${props.label ?? messages.value.timeInput.placeholder} options`)

function openSheet(): void {
  if (!locked.value)
    sheetOpen.value = true
}

function onSheetKeydown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event) || locked.value)
    return
  if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
    event.preventDefault()
    openSheet()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event))
    return
  if (event.key === 'Escape' && isOptionsOpen.value) {
    event.preventDefault()
    closeOptions()
    return
  }
  if (locked.value)
    return
  if (showsOptions.value && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault()
    if (!isOptionsOpen.value)
      openOptions()
    else
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (event.key === 'Enter') {
    if (isOptionsOpen.value) {
      event.preventDefault()
      if (activeOption.value >= 0)
        selectOption(activeOption.value)
      return
    }
    // 收下打进来的文字，但不拦着 Enter，外面的表单照常提交。
    typed.commit()
    return
  }
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
    return
  event.preventDefault()
  const delta = event.key === 'ArrowUp' ? props.increment : -props.increment
  const next = shiftTime(model.value || '00:00', delta, props.hasSeconds)
  if (isTimeInRange(next, props.min, props.max))
    commit(next)
}

async function onBlur(): Promise<void> {
  focused.value = false
  typed.onBlur()
  disabledTooltip.onBlur()
  if (surface.value === 'text') {
    // 调用方即使直接写了原生 input 的 value，blur 后也同步回字段显示的文字。
    await nextTick()
    const input = container.value?.querySelector('input')
    if (input instanceof HTMLInputElement)
      input.value = draft.value
  }
}

function onInputFocus(event: FocusEvent): void {
  focused.value = true
  typed.onFocus()
  disabledTooltip.onFocus(event)
}

function resolvedDescribedBy(): string | undefined {
  return [props.describedBy, showsDisabledMessage.value ? disabledMessageId : undefined].filter(Boolean).join(' ') || undefined
}

function clear(): void {
  if (locked.value)
    return
  commit(null)
}

function focusInput(): void {
  container.value?.querySelector('input')?.focus({ preventScroll: true })
}

function onControlClick(event: MouseEvent): void {
  if (surface.value === 'sheet') {
    openSheet()
    return
  }
  if (locked.value)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button'))
    return
  openOptions()
}

function onInputClick(): void {
  openOptions()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点控件空白处把焦点交给输入框，键盘交互由输入框自己处理。 -->
  <div
    ref="container"
    class="astryx-time-input astryx-bordered-control"
    :class="controlClass"
    :style="controlStyle"
    :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-loading="busy || undefined"
    :data-presentation="surface === 'sheet' ? 'bottom-sheet' : surface === 'native' ? 'native' : 'text'"
    :data-options-open="isOptionsOpen || undefined"
    @pointerenter="disabledTooltip.onPointerEnter"
    @pointerleave="disabledTooltip.onPointerLeave"
    @click="onControlClick"
  >
    <Icon class="astryx-time-input-icon" icon="clock" size="sm" />
    <input
      v-if="surface === 'native'"
      v-bind="attrs"
      :id="inputId" class="astryx-time-input-control" type="time"
      :value="model ?? ''" :min="min" :max="max" :step="hasSeconds ? 1 : increment * 60"
      :readonly="isReadOnly || busy || isDisabled"
      :aria-disabled="isDisabled || undefined" :aria-busy="busy || undefined"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="resolvedDescribedBy()" :aria-required="ariaRequired"
      :aria-invalid="status?.type === 'error' || undefined"
      @input="onNativeInput" @blur="onNativeBlur"
    >
    <input
      v-else-if="surface === 'sheet'"
      v-bind="attrs"
      :id="inputId" class="astryx-time-input-control" type="text" readonly inputmode="none" autocomplete="off"
      role="combobox" aria-haspopup="dialog" :aria-expanded="sheetOpen" :aria-controls="sheetId"
      :value="draft" :placeholder="shownPlaceholder"
      :aria-disabled="isDisabled || undefined" :aria-busy="busy || undefined"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="resolvedDescribedBy()" :aria-required="ariaRequired"
      :aria-invalid="status?.type === 'error' || undefined"
      @click="openSheet" @keydown="onSheetKeydown" @focus="onInputFocus"
    >
    <input
      v-else
      v-bind="attrs"
      :id="inputId" class="astryx-time-input-control" type="text" inputmode="text" autocomplete="off"
      :value="draft" :placeholder="shownPlaceholder"
      :readonly="isReadOnly || busy || isDisabled"
      :aria-disabled="isDisabled || undefined" :aria-busy="busy || undefined"
      :role="showsOptions ? 'combobox' : undefined"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="resolvedDescribedBy()" :aria-required="ariaRequired"
      :aria-invalid="status?.type === 'error' || undefined"
      :name="typed.isInvalid.value ? undefined : (attrs.name as string | undefined)"
      :aria-expanded="showsOptions ? isOptionsOpen : undefined"
      :aria-controls="showsOptions ? listboxId : undefined"
      :aria-autocomplete="showsOptions ? 'list' : undefined"
      :aria-activedescendant="isOptionsOpen && activeOption >= 0 ? `${listboxId}-option-${activeOption}` : undefined"
      @input="onInput" @focus="onInputFocus" @blur="onBlur" @keydown="onKeydown" @click="onInputClick"
    >
    <IconButton v-if="hasClear && model && !locked" class="astryx-input-clear-button" variant="ghost" size="sm" :label="clearLabel" @click="clear">
      <FieldIcon type="clear" />
    </IconButton>
    <Spinner v-if="busy" size="sm" aria-hidden="true" />
    <FieldIcon v-else-if="status" :type="status.type" />
  </div>
  <input v-if="typed.isInvalid.value && attrs.name" type="hidden" :name="attrs.name as string" :value="model ? formatCommitted(model) : ''">
  <div class="astryx-date-input-alert" role="alert">
    {{ typed.alertMessage.value }}
  </div>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="`${disabledMessageId}-tooltip`" :anchor="container" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
  <BottomSheet v-if="surface === 'sheet'" v-model:is-open="sheetOpen" :label="label || messages.timeInput.placeholder" height="hug" :padding="0">
    <div :id="sheetId" class="astryx-time-touch">
      <TouchTimeWheels
        :model-value="model"
        :hour-format="hourFormat"
        :has-seconds="hasSeconds"
        :min="min"
        :max="max"
        @update:model-value="commit"
      />
      <button type="button" class="astryx-date-touch-save" @click="sheetOpen = false">
        {{ messages.dateInput.savePicking }}
      </button>
    </div>
  </BottomSheet>
  <Teleport to="body">
    <div
      v-show="isOptionsOpen"
      :id="listboxId"
      ref="options"
      class="astryx-time-input-options astryx-layer"
      role="listbox"
      :aria-label="resolvedOptionsLabel"
      :style="optionsStyle"
      tabindex="-1"
    >
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events -- 选项不进 Tab 序，键盘由输入框代管。 -->
      <div
        v-for="(option, index) in timeOptions"
        :id="`${listboxId}-option-${index}`"
        :key="option"
        class="astryx-time-input-option"
        :class="{ 'is-active': index === activeOption }"
        role="option"
        :aria-selected="option === model ? 'true' : 'false'"
        :data-option-index="index"
        tabindex="-1"
        @mousedown.prevent
        @click="selectOption(index)"
      >
        {{ formatDisplayTime(option, hourFormat, hasSeconds, locale) }}
      </div>
    </div>
  </Teleport>
</template>
