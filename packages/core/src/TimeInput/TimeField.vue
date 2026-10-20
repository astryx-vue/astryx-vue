<script setup lang="ts">
import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TimeInputSize } from './types.js'
import { computed, nextTick, ref, shallowRef, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useCoarsePointer } from '../composables/useCoarsePointer.js'
import { useDismiss } from '../composables/useDismiss.js'
import { formatDisplayTime, formatISOTime, isTimeInRange, parseDisplayTime, resolveTimeSurface, shiftTime } from '../composables/useTimeValue.js'
import FieldIcon from '../Field/FieldIcon.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
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
  isLoading?: boolean
  loadingLabel?: string
  /** 预设时间的分钟间隔。传了它就会在时钟图标下弹出一个预设列表。 */
  optionInterval?: number
  /** 预设列表的无障碍名字。默认是「时间 + options」。 */
  optionsLabel?: string
  /** 为什么禁用。和 `isDisabled` 一起用时，字段仍可聚焦（带 `aria-disabled`），但不能改值。 */
  disabledMessage?: string
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
const container = useTemplateRef<HTMLDivElement>('container')
const optionsRef = useTemplateRef<HTMLDivElement>('options')
useScrollbars(optionsRef)
const generatedId = `astryx-time-field-${useId()}`
const listboxId = `${props.inputId ?? generatedId}-options`
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

const timeOptions = computed<string[]>(() => {
  const interval = props.optionInterval
  if (interval == null || interval <= 0)
    return []
  const options: string[] = []
  for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
    const value = formatISOTime({ hours: Math.floor(minutes / 60), minutes: minutes % 60, seconds: 0 }, props.hasSeconds)
    if (isTimeInRange(value, props.min, props.max))
      options.push(value)
  }
  return options
})
const showsOptions = computed(() => timeOptions.value.length > 0)
const resolvedOptionsLabel = computed(() => props.optionsLabel ?? `${props.label ?? messages.value.timeInput.placeholder} options`)
const isOptionsOpen = shallowRef(false)
const activeOption = shallowRef(-1)
const optionsPosition = usePositionedLayer({
  anchor: container,
  layer: optionsRef,
  isOpen: isOptionsOpen,
  placement: computed(() => 'below' as const),
  alignment: computed(() => 'start' as const),
  gap: 4,
})
const optionsStyle = computed(() => ({
  top: `${optionsPosition.position.value.top}px`,
  left: `${optionsPosition.position.value.left}px`,
}))

useDismiss({
  container: optionsRef,
  trigger: container,
  isEnabled: isOptionsOpen,
  enableEscape: ref(false),
  onDismiss: () => closeOptions(),
})

function onKeydown(event: KeyboardEvent): void {
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
  if (event.key === 'Enter' && isOptionsOpen.value) {
    event.preventDefault()
    if (activeOption.value >= 0)
      selectOption(activeOption.value)
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

function onBlur(): void {
  focused.value = false
  disabledTooltip.onBlur()
  if (surface.value === 'text')
    commitText(draft.value)
}

function onInputFocus(event: FocusEvent): void {
  focused.value = true
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

function optionIndexFor(value: string | null): number {
  if (value == null)
    return -1
  return timeOptions.value.indexOf(value)
}

function openOptions(): void {
  if (locked.value || !showsOptions.value || isOptionsOpen.value)
    return
  activeOption.value = optionIndexFor(model.value)
  isOptionsOpen.value = true
  void nextTick(() => scrollActiveOption())
}

function closeOptions(): void {
  isOptionsOpen.value = false
  activeOption.value = -1
}

function scrollActiveOption(): void {
  const layer = optionsRef.value
  const index = activeOption.value
  if (!layer || index < 0)
    return
  const option = layer.querySelector<HTMLElement>(`[data-option-index="${index}"]`)
  if (!option)
    return
  const layerRect = layer.getBoundingClientRect()
  const optionRect = option.getBoundingClientRect()
  if (optionRect.top < layerRect.top)
    layer.scrollTop -= layerRect.top - optionRect.top
  else if (optionRect.bottom > layerRect.bottom)
    layer.scrollTop += optionRect.bottom - layerRect.bottom
}

function moveActive(step: number): void {
  const total = timeOptions.value.length
  if (total === 0)
    return
  const current = activeOption.value < 0 ? (step > 0 ? -1 : total) : activeOption.value
  activeOption.value = (current + step + total) % total
  void nextTick(() => scrollActiveOption())
}

function selectOption(index: number): void {
  const value = timeOptions.value[index]
  if (value == null || locked.value)
    return
  commit(value)
  closeOptions()
  focusInput()
}

function focusInput(): void {
  container.value?.querySelector('input')?.focus({ preventScroll: true })
}

function onControlClick(event: MouseEvent): void {
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
    :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-loading="busy || undefined"
    :data-options-open="isOptionsOpen || undefined"
    @pointerenter="disabledTooltip.onPointerEnter"
    @pointerleave="disabledTooltip.onPointerLeave"
    @click="onControlClick"
  >
    <Icon class="astryx-time-input-icon" icon="clock" size="sm" />
    <input
      v-if="surface === 'native'"
      :id="inputId" class="astryx-time-input-control" type="time"
      :value="model ?? ''" :min="min" :max="max" :step="hasSeconds ? 1 : increment * 60"
      :disabled="isDisabled && !showsDisabledMessage" :readonly="isReadOnly || busy || showsDisabledMessage"
      :aria-disabled="showsDisabledMessage || undefined" :aria-busy="busy || undefined"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="resolvedDescribedBy()" :aria-required="isRequired || undefined"
      :aria-invalid="status?.type === 'error' || undefined"
      @input="onNativeInput"
    >
    <input
      v-else
      :id="inputId" class="astryx-time-input-control" type="text" inputmode="text" autocomplete="off"
      :value="draft" :placeholder="shownPlaceholder"
      :disabled="isDisabled && !showsDisabledMessage" :readonly="isReadOnly || busy || showsDisabledMessage"
      :aria-disabled="showsDisabledMessage || undefined" :aria-busy="busy || undefined"
      :role="showsOptions ? 'combobox' : undefined"
      :aria-label="labelledBy ? undefined : label" :aria-labelledby="labelledBy"
      :aria-describedby="resolvedDescribedBy()" :aria-required="isRequired || undefined"
      :aria-invalid="status?.type === 'error' || undefined"
      :aria-expanded="showsOptions ? isOptionsOpen : undefined"
      :aria-controls="showsOptions ? listboxId : undefined"
      :aria-autocomplete="showsOptions ? 'list' : undefined"
      :aria-activedescendant="isOptionsOpen && activeOption >= 0 ? `${listboxId}-option-${activeOption}` : undefined"
      @input="onInput" @focus="onInputFocus" @blur="onBlur" @keydown="onKeydown" @click="onInputClick"
    >
    <IconButton v-if="hasClear && model && !locked" class="astryx-input-clear-button" variant="ghost" size="sm" :label="clearLabel" @click="clear">
      <FieldIcon type="clear" />
    </IconButton>
    <Spinner v-if="busy" size="sm" :aria-label="loadingLabel ?? messages.timeInput.loading" />
    <FieldIcon v-else-if="status" :type="status.type" />
  </div>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="`${disabledMessageId}-tooltip`" :anchor="container" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
  <Teleport to="body">
    <div
      v-show="isOptionsOpen"
      :id="listboxId"
      ref="options"
      class="astryx-time-input-options"
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
        {{ formatDisplayTime(option, hourFormat, hasSeconds) }}
      </div>
    </div>
  </Teleport>
</template>
