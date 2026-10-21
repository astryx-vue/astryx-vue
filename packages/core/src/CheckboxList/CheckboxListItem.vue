<script setup lang="ts">
import type { CheckboxValue } from '../CheckboxInput/types.js'
import type { CheckboxListItemEmits, CheckboxListItemProps, CheckboxListItemSlots } from './types.js'
import { computed, inject, useId, useSlots, useTemplateRef } from 'vue'
import ListItem from '../List/ListItem.vue'
import { useAstryxMessages } from '../locale/index.js'
import CheckboxListControl from './CheckboxListControl.vue'
import { checkboxListKey } from './context.js'

defineOptions({ name: 'AstryxCheckboxListItem' })

const props = defineProps<CheckboxListItemProps>()
const emit = defineEmits<CheckboxListItemEmits>()
defineSlots<CheckboxListItemSlots>()

const context = inject(checkboxListKey, undefined)
const slots = useSlots()
const messages = useAstryxMessages()
const richLabel = computed(() => slots.label != null)
const visibleLabelId = `astryx-checkbox-item-label-${useId()}`
const checkbox = useTemplateRef<InstanceType<typeof CheckboxListControl>>('checkbox')
const interactiveRef = computed(() => checkbox.value?.element ?? null)
const collection = computed(() => context != null && context.values.value != null)

const checked = computed<CheckboxValue>(() => {
  if (collection.value && props.value != null)
    return context?.values.value?.includes(props.value) ?? false
  return props.isChecked ?? false
})

const disabled = computed(() => props.isDisabled || context?.isDisabled.value)
const readOnly = computed(() => context?.isReadOnly.value ?? false)
const loading = computed(() => props.isLoading || (props.value != null && (context?.loadingValues.value.includes(props.value) ?? false)))
const reason = computed(() => context?.isDisabled.value ? context.disabledReason.value : undefined)
const selected = computed(() => checked.value === true && !disabled.value && !readOnly.value)

if (collection.value && props.value == null)
  throw new Error('CheckboxListItem 在集合模式下必须提供 value。')

function onChecked(value: CheckboxValue): void {
  if (disabled.value || readOnly.value || loading.value)
    return
  const next = value === true
  if (collection.value && props.value != null)
    context?.toggle(props.value, next)
  else
    emit('check', next)
}
</script>

<template>
  <ListItem
    :label="label" :description="description" :is-selected="selected" :is-disabled="disabled"
    :aria-busy="loading || undefined" :interactive-ref="interactiveRef"
  >
    <template #label>
      <span v-if="richLabel" :id="visibleLabelId"><slot name="label" /></span>
      <span v-else aria-hidden="true">{{ label }}</span>
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template #startContent>
      <CheckboxListControl
        ref="checkbox" :model-value="checked" :label="ariaLabel ?? (richLabel ? messages.checkboxList.checkbox : label)"
        :size="context?.size.value ?? 'md'" :is-disabled="disabled" :is-read-only="readOnly"
        :is-loading="loading" :loading-label="messages.checkboxList.loading" :disabled-message="reason"
        :aria-labelledby="richLabel && !ariaLabel ? visibleLabelId : undefined"
        @update:model-value="onChecked"
      />
    </template>
    <template v-if="$slots.end" #endContent>
      <slot name="end" />
    </template>
  </ListItem>
</template>
