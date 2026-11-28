<script setup lang="ts">
import type { RadioEmits, RadioProps, RadioSlots } from './types.js'
import { computed, mergeProps, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { pressBoxProps } from '../composables/internal/pressBox.js'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useIndicator } from '../Indicator/useIndicator.js'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { registerBoxHold } from '../utils/boxHold.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import { radioContextKey } from './types.js'

defineOptions({ name: 'AstryxRadio', inheritAttrs: false })
const props = defineProps<RadioProps>()
const emit = defineEmits<RadioEmits>()
defineSlots<RadioSlots>()
const attrs = useAttrs()
const slots = useSlots()
const press = usePressFeedback({ hasOverlay: false })
// 只有用到框的组件才装框按住，只有按钮和链接的页面不带这段代码。
registerBoxHold()
const context = readLayerScoped(radioContextKey)
const generatedId = `astryx-radio-option-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const name = computed(() => context?.name.value ?? attrs.name as string ?? inputId.value)
const selectedValue = computed(() => context?.selectedValue.value ?? null)
const isSelected = computed(() => selectedValue.value === props.value)
const isDisabled = computed(() => props.isDisabled || context?.isGroupDisabled.value)
const isReadOnly = computed(() => props.isReadOnly || context?.isGroupReadOnly.value)
const groupMessage = computed(() => context?.disabledMessage.value)
const explainedByMessage = computed(() => isDisabled.value && groupMessage.value != null)
const messageDescriptionId = computed(() => explainedByMessage.value ? context?.disabledMessageId.value : undefined)
const RadioMark = useIndicator('radio')
// 粗指针下整行朝 44px 长出一圈看不见的热区，行自己的大小不变。
const row = useTemplateRef<HTMLElement>('row')
useTouchHitArea(row, () => !isDisabled.value)
const indicatorSize = computed(() => context?.size?.value)

function change(event: Event): void {
  if (isDisabled.value || isReadOnly.value)
    return
  if (context)
    context.select(props.value, event)
  else
    emit('change', props.value, event as CustomEvent)
}

/** 只因 `disabledMessage` 而“禁用”时，仍然能聚焦，用取消点击来拦住切换。 */
function click(event: MouseEvent): void {
  if (explainedByMessage.value)
    event.preventDefault()
}

const hasDescription = computed(() => !!props.description || slots.description != null)
function describedBy(): string | undefined {
  return [hasDescription.value ? `${inputId.value}-description` : undefined, messageDescriptionId.value].filter(Boolean).join(' ') || undefined
}
// 禁用的单选项还能聚焦（整组带原因时），调用方的处理函数除了聚焦和失焦都不运行。
const rowAttrs = computed(() => mergeProps(withholdCallerHandlers(attrs, !!isDisabled.value), isDisabled.value ? {} : press.pressableProps))
function rowClick(event: MouseEvent): void {
  const target = event.target
  if (target instanceof Element && target.closest('a, button, select, textarea, [role="button"], [role="link"]'))
    event.preventDefault()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 标签包住整行。点到链接时取消标签的默认选中，键盘仍由单选框处理。 -->
  <label ref="row" v-bind="rowAttrs" :for="inputId" class="astryx-radio" :class="{ 'astryx-indicator-scope': !isDisabled, 'astryx-touch-hit-area-band': !isDisabled }" :data-size="indicatorSize" :data-align="align && align !== 'center' ? align : undefined" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined" @click="rowClick">
    <input
      :id="inputId" class="astryx-radio-native" type="radio" :name="name" :value="value"
      :checked="isSelected" :disabled="isDisabled && !explainedByMessage" :readonly="isReadOnly"
      :form="explainedByMessage ? '' : undefined"
      :aria-disabled="explainedByMessage || undefined"
      :required="context?.isRequired.value || undefined"
      :aria-invalid="context?.isRequired.value ? context.hasErrorStatus.value : undefined"
      :aria-describedby="describedBy()"
      @click="click" @change="change"
    >
    <!-- iOS 对按住圆圈的手指只给文字选区、不给点击。按压控制器在手指按住标记过的圆圈时锁住整行的选区，没等到点击就替它选中。 -->
    <component
      :is="RadioMark"
      v-bind="isDisabled ? undefined : pressBoxProps"
      :state="isSelected ? 'checked' : 'unchecked'"
      :size="indicatorSize"
      :is-disabled="isDisabled"
    />
    <span class="astryx-radio-content">
      <span class="astryx-radio-label">
        <slot name="label">{{ label }}</slot>
      </span>
      <span v-if="hasDescription" :id="`${inputId}-description`" class="astryx-radio-description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-if="$slots.end" class="astryx-radio-end"><slot name="end" /></span>
  </label>
</template>
