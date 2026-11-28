<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SelectableCardGroupContext, SelectableCardGroupEmits, SelectableCardGroupProps, SelectableCardGroupSlots } from './types.js'
import { Field } from '@astryx-vue/core'
import { computed, provide, useAttrs, useId } from 'vue'
import { selectableCardGroupKey } from './types.js'
import '../../styles/selectable-card-group.css'

defineOptions({ name: 'AstryxSelectableCardGroup', inheritAttrs: false })

const props = withDefaults(defineProps<SelectableCardGroupProps>(), {
  selectionMode: 'single',
  orientation: 'horizontal',
  isLabelHidden: false,
  isDisabled: false,
})
const emit = defineEmits<SelectableCardGroupEmits>()
defineSlots<SelectableCardGroupSlots>()

const attrs = useAttrs()
const labelId = `astryx-selectable-card-group-label-${useId()}`
const inputId = `astryx-selectable-card-group-${useId()}`
const descriptionId = `astryx-selectable-card-group-description-${useId()}`
const generatedName = `astryx-selectable-card-group-name-${useId()}`

const isMultiple = computed(() => props.selectionMode === 'multiple')
const submitName = computed(() => props.htmlName ?? generatedName)

const labelledBy = computed(() => [labelId, attrs['aria-labelledby']].filter(Boolean).join(' '))
const describedBy = computed(() =>
  [props.description != null && props.description !== '' ? descriptionId : undefined, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined,
)
const groupAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !['class', 'style', 'aria-labelledby', 'aria-describedby'].includes(key)),
))

const selectedValues = computed<readonly string[]>(() => {
  if (Array.isArray(props.modelValue))
    return props.modelValue
  return typeof props.modelValue === 'string' ? [props.modelValue] : []
})

function commit(next: string | string[]): void {
  emit('update:modelValue', next)
  emit('change', next)
}

/** 单选的单选框按生成的名字分组（页面里唯一），所以同名的另一个表单的组不会串到一起。 */
const context = computed<SelectableCardGroupContext>(() => ({
  inputType: isMultiple.value ? 'checkbox' : 'radio',
  groupName: isMultiple.value ? submitName.value : generatedName,
  submitName: submitName.value,
  isDisabled: props.isDisabled,
  isSelected: value => selectedValues.value.includes(value),
  change: (value, isSelected) => {
    if (isMultiple.value) {
      const others = selectedValues.value.filter(item => item !== value)
      commit(isSelected ? [...others, value] : others)
      return
    }
    if (isSelected)
      commit(value)
  },
}))

provide(selectableCardGroupKey, () => context.value)
</script>

<template>
  <Field
    :label="label"
    :input-id="inputId"
    :label-id="labelId"
    is-group-label
    :is-label-hidden="isLabelHidden"
    :description="description"
    :description-id="descriptionId"
    :is-disabled="isDisabled"
    :class="attrs.class"
    :style="attrs.style as StyleValue"
  >
    <div
      v-bind="groupAttrs"
      class="astryx-selectable-card-group"
      :role="isMultiple ? 'group' : 'radiogroup'"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-disabled="isDisabled || undefined"
      :data-orientation="orientation"
      :data-selection-mode="selectionMode"
    >
      <slot />
    </div>
  </Field>
</template>
