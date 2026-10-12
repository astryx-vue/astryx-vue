<script setup lang="ts">
import type { CheckboxListEmits, CheckboxListProps } from './types.js'
import { computed, provide, useId } from 'vue'
import Field from '../Field/Field.vue'
import List from '../List/List.vue'
import { checkboxListKey } from './context.js'
import '../../styles/checkbox-list.css'

defineOptions({ name: 'AstryxCheckboxList' })

const props = withDefaults(defineProps<Omit<CheckboxListProps, 'modelValue'>>(), {
  density: 'balanced',
  hasDividers: false,
  statusVariant: 'detached',
})

const emit = defineEmits<CheckboxListEmits>()
const model = defineModel<string[]>()
const generatedId = `astryx-checkbox-list-${useId()}`
const inputId = computed(() => props.id ?? generatedId)

function toggle(value: string, checked: boolean): void {
  const current = model.value ?? []
  const next = checked
    ? current.includes(value) ? current : [...current, value]
    : current.filter(item => item !== value)
  model.value = next
  emit('change', next)
}

provide(checkboxListKey, {
  values: model,
  toggle,
  isDisabled: computed(() => props.isDisabled ?? false),
  size: computed(() => props.density === 'compact' ? 'sm' : 'md'),
})
</script>

<template>
  <Field
    class="astryx-checkbox-list" :label="label" :input-id="inputId" is-group-label
    :description="description" :width="width" :is-label-hidden="isLabelHidden" :is-disabled="isDisabled"
    :is-optional="isOptional" :is-required="isRequired" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <List :density="density" :has-dividers="hasDividers" :aria-labelledby="field.labelId" :aria-describedby="field.describedBy">
        <slot />
      </List>
    </template>
  </Field>
</template>
