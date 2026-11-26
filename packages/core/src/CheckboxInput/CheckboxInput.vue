<script setup lang="ts">
import type { CSSProperties, InputHTMLAttributes } from 'vue'
import type { CheckboxInputEmits, CheckboxInputProps, CheckboxInputSlots, CheckboxValue } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import FieldLabel from '../Field/FieldLabel.vue'
import FieldStatus from '../Field/FieldStatus.vue'
import { ariaRequired as resolveAriaRequired } from '../FormLayout/context.js'
import { useIndicator } from '../Indicator/useIndicator.js'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { checkboxRowPressKey } from './rowPress.js'
import { useCheckboxAction } from './useCheckboxAction.js'
import '../../styles/checkbox-input.css'
import '../../styles/button.css'

defineOptions({ name: 'AstryxCheckboxInput', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<CheckboxInputProps, 'modelValue'>>(), { size: 'md', loadingLabel: 'Loading' })
const emit = defineEmits<CheckboxInputEmits>()
defineSlots<CheckboxInputSlots>()
// 没勾的复选框、关着的开关本身就是一个答案：表单的默认必填不让它们变成必填，只有自己的 isRequired 才算。
const ariaRequired = computed(() => resolveAriaRequired(props.isRequired, props.isOptional, undefined))
const model = defineModel<CheckboxValue>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef<HTMLInputElement>('input')
const generatedId = `astryx-checkbox-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${inputId.value}-label`)
const descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined)
const statusId = computed(() => props.status?.message ? (props.status.messageId ?? `${inputId.value}-status`) : undefined)
const disabledId = `${generatedId}-disabled`
const loadingId = `${generatedId}-loading`
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const tooltip = useButtonTooltip(showsDisabledMessage)
const action = useCheckboxAction({ model, changeAction: () => props.changeAction, emitChange: (value, event) => emit('change', value, event), emitError: (error, value, event) => emit('actionError', error, value, event) })
const busy = computed(() => !!props.isLoading || action.isPending.value)
const blocked = computed(() => props.isDisabled || props.isReadOnly || busy.value)
const state = computed(() => action.value.value === 'indeterminate' ? 'indeterminate' : action.value.value ? 'checked' : 'unchecked')
const CheckboxMark = useIndicator('checkbox')
const press = usePressFeedback({ hasOverlay: false })
// 外面有整行在回应按压（列表行）时，按压由那一行画，这一行不再单独当按压表面。
const rowOwnsPress = readLayerScoped(checkboxRowPressKey)
// 有标签的复选框，粗指针下整行朝 44px 长出一圈看不见的热区，行自己的大小不变。
// 标签隐藏的复选框是别的组件那一行里的标记，目标由那一行负责。
const row = useTemplateRef<HTMLElement>('row')
const hasHitArea = computed(() => !props.isLabelHidden && !props.isDisabled && !props.isReadOnly)
useTouchHitArea(row, hasHitArea)
/** 按下落在行自己（不是里面的控件）上时，这次按下的位置。 */
let rowPress: { x: number, y: number } | null = null
function rowPointerDown(event: PointerEvent): void {
  rowPress = event.target === event.currentTarget ? { x: event.clientX, y: event.clientY } : null
}
/** 起点在热区（行盒子之外）的点按，和点在复选框上一样切换它；代码发出的点击（detail 为 0）不算。 */
function rowClick(event: MouseEvent): void {
  const start = rowPress
  rowPress = null
  if (start == null || event.detail === 0 || event.target !== event.currentTarget)
    return
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (start.x < box.left || start.x > box.right || start.y < box.top || start.y > box.bottom)
    input.value?.click()
}
const widthStyle = computed<CSSProperties>(() => ({ width: typeof props.width === 'number' ? `${props.width}px` : props.width }))
const element = computed(() => input.value ?? null)
function focus(options?: FocusOptions): void {
  input.value?.focus(options)
}
function blur(): void {
  input.value?.blur()
}
defineExpose({ element, focus, blur })

const controlledAttrs = new Set(['class', 'style', 'id', 'type', 'checked', 'indeterminate', 'disabled', 'readonly', 'autofocus', 'role', 'aria-checked', 'aria-labelledby', 'aria-describedby', 'aria-disabled', 'aria-readonly', 'aria-required', 'aria-busy'])
function inputAttrs(): InputHTMLAttributes {
  // 禁用的复选框还能聚焦，浏览器照常派发事件；调用方的处理函数除了聚焦和失焦都不运行。
  return Object.fromEntries(Object.entries(withholdCallerHandlers(attrs, !!props.isDisabled)).filter(([key]) => !controlledAttrs.has(key))) as InputHTMLAttributes
}
function describedBy(): string | undefined {
  return [attrs['aria-describedby'], descriptionId.value, statusId.value, showsDisabledMessage.value ? disabledId : undefined, busy.value ? loadingId : undefined].filter(Boolean).join(' ') || undefined
}
function labelledBy(): string {
  const external = attrs['aria-labelledby']
  if (typeof external === 'string' && external.trim() !== '')
    return external
  return [labelId.value, external].filter(Boolean).join(' ')
}
function syncNative(): void {
  if (input.value) {
    input.value.checked = action.value.value === true
    input.value.indeterminate = action.value.value === 'indeterminate'
  }
}
function click(event: MouseEvent): void {
  if (blocked.value) {
    event.preventDefault()
    // Only canceled clicks need repair here. Normal clicks must reach change
    // before synchronization; browsers can flush microtasks between events.
    void nextTick(syncNative)
  }
}
function change(event: Event): void {
  if (!blocked.value && input.value)
    action.commit(input.value.checked, event)
  void nextTick(syncNative)
}
function reset(event: Event): void {
  if (event.target === input.value?.form)
    void nextTick(syncNative)
}
function keydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    tooltip.hideImmediately()
}
let ownerDocument: Document | undefined
onMounted(() => {
  syncNative()
  ownerDocument = input.value?.ownerDocument
  ownerDocument?.addEventListener('reset', reset, true)
  if (props.hasAutoFocus)
    focus({ preventScroll: true })
})
onUpdated(syncNative)
onBeforeUnmount(() => ownerDocument?.removeEventListener('reset', reset, true))
</script>

<template>
  <div class="astryx-checkbox-input" :class="attrs.class" :style="[widthStyle, attrs.style as CSSProperties]" :data-size="size" :data-status="status?.type" :data-blocked="blocked || undefined">
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点击只用来把热区上的点按交给里面的复选框，键盘由复选框自己处理。 -->
    <div ref="row" class="astryx-checkbox-row" :class="{ 'astryx-indicator-scope': !blocked, 'astryx-touch-hit-area-band': hasHitArea }" v-bind="blocked || rowOwnsPress ? undefined : press.pressableProps" @pointerenter="tooltip.onPointerEnter" @pointerleave="tooltip.onPointerLeave" @pointerdown="hasHitArea ? rowPointerDown($event) : undefined" @click="hasHitArea ? rowClick($event) : undefined">
      <span class="astryx-checkbox-control">
        <input
          v-bind="inputAttrs()" :id="inputId" ref="input" class="astryx-checkbox-native" type="checkbox"
          :checked="action.value.value === true"
          :name="isDisabled ? undefined : (htmlName ?? inputAttrs().name)" :form="isDisabled ? '' : inputAttrs().form"
          :required="(isRequired && !isOptional) || inputAttrs().required" :readonly="isReadOnly || showsDisabledMessage"
          :aria-labelledby="labelledBy()" :aria-describedby="describedBy()"
          :aria-disabled="isDisabled || undefined" :aria-readonly="isReadOnly || undefined" :aria-busy="busy || undefined"
          :aria-required="ariaRequired" :aria-invalid="status?.type === 'error' ? true : isRequired ? false : inputAttrs()['aria-invalid']"
          @click="click" @change="change" @keydown="keydown" @focus="tooltip.onFocus" @blur="tooltip.onBlur"
        >
        <component :is="CheckboxMark" :state="state" :size="size" :is-disabled="isDisabled">
          <span v-if="busy" class="astryx-checkbox-spinner" />
        </component>
      </span>
      <FieldLabel
        :label="label" :input-id="inputId" :label-id="labelId" :description="description" :description-id="descriptionId"
        :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired" target-class="astryx-checkbox-label"
        :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
      >
        <template v-if="$slots.labelIcon" #labelIcon>
          <slot name="labelIcon" />
        </template>
      </FieldLabel>
    </div>
    <FieldStatus :id="statusId" :type="status?.type ?? 'success'" :message="status?.message ?? ''" variant="detached" />
    <VisuallyHidden v-if="showsDisabledMessage" :id="disabledId">
      {{ disabledMessage }}
    </VisuallyHidden>
    <VisuallyHidden v-if="busy" :id="loadingId" role="status">
      {{ loadingLabel }}
    </VisuallyHidden>
  </div>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="`${generatedId}-tooltip`" :anchor="input" :open="tooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="tooltip.onTooltipPointerEnter" @pointer-leave="tooltip.onTooltipPointerLeave"
  />
</template>
