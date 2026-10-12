<script setup lang="ts">
import type { CheckboxValue } from '../CheckboxInput/types.js'
import type { CheckboxListItemEmits, CheckboxListItemProps, CheckboxListItemSlots } from './types.js'
import { computed, inject, useTemplateRef } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import { useItemDescriptionId } from '../List/context.js'
import ListItem from '../List/ListItem.vue'
import { checkboxListKey } from './context.js'

defineOptions({ name: 'AstryxCheckboxListItem' })

const props = defineProps<CheckboxListItemProps>()
const emit = defineEmits<CheckboxListItemEmits>()
defineSlots<CheckboxListItemSlots>()

const context = inject(checkboxListKey, undefined)
const descriptionId = useItemDescriptionId()
const checkbox = useTemplateRef<InstanceType<typeof CheckboxInput>>('checkbox')
const interactiveRef = computed(() => checkbox.value?.element ?? null)
const collection = computed(() => context != null && context.values.value != null)

const checked = computed<CheckboxValue>(() => {
  if (collection.value && props.value != null)
    return context?.values.value?.includes(props.value) ?? false
  return props.isChecked ?? false
})

const disabled = computed(() => props.isDisabled || context?.isDisabled.value)
const selected = computed(() => checked.value === true)

if (collection.value && props.value == null)
  throw new Error('CheckboxListItem 在集合模式下必须提供 value。')

function onChecked(value: CheckboxValue): void {
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
    :interactive-ref="interactiveRef"
  >
    <template #label>
      <span aria-hidden="true">{{ label }}</span>
    </template>
    <template #startContent>
      <CheckboxInput
        ref="checkbox" :model-value="checked" :label="label" is-label-hidden
        :size="context?.size.value ?? 'md'" :is-disabled="disabled"
        :aria-describedby="descriptionId ?? undefined"
        @update:model-value="onChecked"
      />
    </template>
    <template v-if="$slots.end" #endContent>
      <slot name="end" />
    </template>
  </ListItem>
</template>
