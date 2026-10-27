<script setup lang="ts">
import type { CheckboxSize } from '../CheckboxIndicator/types.js'
import type { CheckboxValue } from '../CheckboxInput/types.js'
import { computed, useTemplateRef } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import { useItemDescriptionId } from '../List/context.js'

defineOptions({ name: 'AstryxCheckboxListControl' })

defineProps<{
  modelValue: CheckboxValue
  label: string
  size: CheckboxSize
  isDisabled?: boolean
  isReadOnly?: boolean
  isLoading?: boolean
  loadingLabel?: string
  disabledMessage?: string
  ariaLabelledby?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CheckboxValue]
}>()

const descriptionId = useItemDescriptionId()
const checkbox = useTemplateRef<InstanceType<typeof CheckboxInput>>('checkbox')
const element = computed(() => checkbox.value?.element ?? null)
defineExpose({ element })
</script>

<template>
  <CheckboxInput
    ref="checkbox" :model-value="modelValue" :label="label" is-label-hidden
    :size="size" :is-disabled="isDisabled" :is-read-only="isReadOnly"
    :is-loading="isLoading" :loading-label="loadingLabel" :disabled-message="disabledMessage"
    :aria-describedby="descriptionId ?? undefined" :aria-labelledby="ariaLabelledby"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
