<script setup lang="ts">
import type { RadioEmits, RadioProps, RadioSlots } from './types.js'
import { computed, useAttrs, useId, useSlots } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useIndicator } from '../Indicator/useIndicator.js'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { radioContextKey } from './types.js'

defineOptions({ name: 'AstryxRadio' })
const props = defineProps<RadioProps>()
const emit = defineEmits<RadioEmits>()
defineSlots<RadioSlots>()
const attrs = useAttrs()
const slots = useSlots()
const press = usePressFeedback({ hasOverlay: false })
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
function rowClick(event: MouseEvent): void {
  const target = event.target
  if (target instanceof Element && target.closest('a, button, select, textarea, [role="button"], [role="link"]'))
    event.preventDefault()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 标签包住整行。点到链接时取消标签的默认选中，键盘仍由单选框处理。 -->
  <label :for="inputId" class="astryx-radio" :class="{ 'astryx-indicator-scope': !isDisabled }" v-bind="isDisabled ? undefined : press.pressableProps" :data-size="indicatorSize" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined" @click="rowClick">
    <input
      :id="inputId" class="astryx-radio-native" type="radio" :name="name" :value="value"
      :checked="isSelected" :disabled="isDisabled && !explainedByMessage" :readonly="isReadOnly"
      :form="explainedByMessage ? '' : undefined"
      :aria-disabled="explainedByMessage || undefined"
      :aria-describedby="describedBy()"
      @click="click" @change="change"
    >
    <component
      :is="RadioMark"
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
