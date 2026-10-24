<script setup lang="ts">
import type { DateRange, DateRangeInputEmits, DateRangeInputProps, DateRangePreset } from './types.js'
import { computed, shallowRef, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { applyRangeClick, formatDateRange, isRangeWithinSpan } from '../composables/useDateRange.js'
import { addMonths, todayISODate } from '../composables/useMonthGrid.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import RangeCalendar from './RangeCalendar.vue'
import '../../styles/bordered-control.css'
import '../../styles/date-range-input.css'

defineOptions({ name: 'AstryxDateRangeInput', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<DateRangeInputProps, 'modelValue'>>(), {
  modelValue: null,
  monthCount: 2,
  minRangeSpan: 1,
  hasClear: true,
  size: 'md',
  statusVariant: 'attached',
  isLoading: false,
})

const emit = defineEmits<DateRangeInputEmits>()
const model = defineModel<DateRange | null>({ default: null })
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'DateRangeInput',
  props,
  attrs,
  reservedAttrs: ['id', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled', 'aria-invalid', 'aria-expanded', 'aria-controls'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const ariaRequired = useAriaRequired(props)
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const generatedId = `astryx-date-range-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const open = shallowRef(false)
const pending = shallowRef<string | null>(null)
const today = todayISODate()
const cursor = shallowRef({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) })
const action = usePendingChange(() => props.changeAction)
const busy = computed(() => props.isLoading || action.busy.value)
const locked = computed(() => props.isDisabled || busy.value)
const disabledMessageId = `${generatedId}-disabled`
const disabledMessage = computed(() => props.disabledMessage?.trim() || undefined)
const showsDisabledMessage = computed(() => locked.value && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const panelEl = useTemplateRef<HTMLElement>('panelEl')
useScrollbars(panelEl)
const visibleMonths = computed(() => props.numberOfMonths ?? props.monthCount)

const display = computed(() => formatDateRange(model.value, locale.value))
const placeholder = computed(() => props.placeholder ?? messages.value.dateRangeInput.placeholder)
const clearLabel = computed(() => props.clearLabel ?? messages.value.dateRangeInput.clear(props.label))

function commit(value: DateRange | null): void {
  if (locked.value)
    return
  model.value = value
  emit('change', value)
  void action.run(value)
}

function onSelect(day: string): void {
  const result = applyRangeClick(pending.value, day, props.minRangeSpan, props.maxRangeSpan)
  pending.value = result.pending
  if (result.commit) {
    commit(result.commit)
    open.value = false
  }
}

function onShift(amount: number): void {
  cursor.value = addMonths(cursor.value.year, cursor.value.month, amount)
}

function onOpenChange(next: boolean): void {
  open.value = next
  if (next && model.value) {
    cursor.value = { year: Number(model.value.start.slice(0, 4)), month: Number(model.value.start.slice(5, 7)) }
    pending.value = null
  }
  if (!next)
    pending.value = null
}

function applyPreset(preset: DateRangePreset): void {
  const range = preset.getRange()
  if (!isRangeWithinSpan(range, props.minRangeSpan, props.maxRangeSpan))
    return
  commit(range)
  pending.value = null
  open.value = false
}

function presetDisabled(preset: DateRangePreset): boolean {
  return !isRangeWithinSpan(preset.getRange(), props.minRangeSpan, props.maxRangeSpan)
}

function clear(event: MouseEvent): void {
  pending.value = null
  commit(null)
  open.value = false
  if (event.detail === 0)
    containerRef.value?.querySelector<HTMLButtonElement>('.astryx-date-range-trigger')?.focus({ preventScroll: true })
}

function triggerAttrs(): Record<string, unknown> {
  return parts.forwardedAttrs()
}
</script>

<template>
  <Field
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="hideLabel" :is-disabled="locked" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <Popover
        :is-open="open" :is-enabled="!locked" placement="below" alignment="start"
        :padding="0" width="min(40rem, calc(100vw - 16px))" :has-close-button="false" :is-modal="false"
        role="dialog" :label="messages.dateRangeInput.dialogLabel" @open-change="onOpenChange"
      >
        <div
          ref="containerRef"
          class="astryx-date-range-input astryx-bordered-control" :class="parts.controlClass()" :style="parts.controlStyle()" :data-size="size"
          :data-status="status?.type" :data-disabled="locked || undefined"
          @pointerenter="disabledTooltip.onPointerEnter"
          @pointerleave="disabledTooltip.onPointerLeave"
        >
          <button
            v-bind="triggerAttrs()"
            :id="inputId" type="button" class="astryx-date-range-trigger" :disabled="locked && !showsDisabledMessage"
            :aria-describedby="[attrs['aria-describedby'], field.describedBy, showsDisabledMessage ? disabledMessageId : undefined].filter(Boolean).join(' ') || undefined"
            :aria-invalid="status?.type === 'error' || undefined"
            :aria-busy="busy || undefined" :aria-required="ariaRequired"
            :aria-disabled="showsDisabledMessage || undefined"
            @focus="disabledTooltip.onFocus" @blur="disabledTooltip.onBlur"
          >
            <Icon class="astryx-date-range-icon" icon="calendar" size="sm" />
            <span class="astryx-date-range-value" :data-placeholder="!display || undefined">{{ display || placeholder }}</span>
          </button>
          <IconButton v-if="hasClear && model && !locked" class="astryx-input-clear-button" variant="ghost" size="sm" :label="clearLabel" @click="clear">
            <FieldIcon type="clear" />
          </IconButton>
          <Spinner v-if="busy" size="sm" :aria-label="messages.dateInput.loading" />
          <FieldIcon v-else-if="status" :type="status.type" />
        </div>
        <template #content>
          <div class="astryx-date-range-popover">
            <div ref="panelEl" class="astryx-date-range-panel">
              <div v-if="presets?.length" class="astryx-date-range-presets">
                <button
                  v-for="preset in presets" :key="preset.label" type="button" class="astryx-date-range-preset"
                  :disabled="presetDisabled(preset)" @click="applyPreset(preset)"
                >
                  {{ preset.label }}
                </button>
              </div>
              <RangeCalendar
                :cursor-year="cursor.year" :cursor-month="cursor.month" :month-count="visibleMonths"
                :range="model" :pending="pending" :min="min" :max="max" :date-constraints="dateConstraints"
                :min-range-span="minRangeSpan" :max-range-span="maxRangeSpan" :week-starts-on="weekStartsOn"
                @select="onSelect" @shift="onShift"
              />
            </div>
          </div>
        </template>
      </Popover>
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
