<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TypeaheadEmits, TypeaheadProps, TypeaheadSlots } from './types.js'
import { computed, useId, useTemplateRef } from 'vue'
import Field from '../Field/Field.vue'
import BaseTypeahead from './BaseTypeahead.vue'
import '../../styles/typeahead.css'

defineOptions({ name: 'AstryxTypeahead', inheritAttrs: false })

const props = withDefaults(defineProps<TypeaheadProps<T>>(), {
  modelValue: null,
  labelHidden: false,
  disabled: false,
  status: 'default',
  size: 'md',
  clearable: true,
  debounceMs: 150,
  maxMenuItems: 10,
  showOnFocus: false,
  required: false,
  optional: false,
})

const emit = defineEmits<TypeaheadEmits<T>>()
defineSlots<TypeaheadSlots<T>>()

const inputId = `astryx-typeahead-${useId()}`
const base = useTemplateRef<{ focus: () => void, blur: () => void }>('base')
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})

defineExpose({
  focus: () => base.value?.focus(),
  blur: () => base.value?.blur(),
})
</script>

<template>
  <Field
    class="astryx-typeahead"
    :class="[`size-${props.size}`]"
    :label="props.label"
    :input-id="inputId"
    :description="props.description"
    :is-label-hidden="props.labelHidden"
    :is-disabled="props.disabled"
    :is-required="props.required"
    :is-optional="props.optional"
    :status="fieldStatus"
    :width="props.width"
  >
    <template #default="field">
      <BaseTypeahead
        ref="base"
        :model-value="props.modelValue"
        :search-source="props.searchSource"
        :input-id="field.inputId"
        :described-by="field.describedBy"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :disabled-reason="props.disabledReason"
        :status="props.status"
        :size="props.size"
        :clearable="props.clearable"
        :debounce-ms="props.debounceMs"
        :max-menu-items="props.maxMenuItems"
        :show-on-focus="props.showOnFocus"
        :empty-text="props.emptyText"
        :required="props.required"
        :name="props.name"
        @update:model-value="emit('update:modelValue', $event)"
        @change="emit('change', $event)"
        @search="emit('search', $event)"
        @open-change="emit('openChange', $event)"
      >
        <template v-if="$slots.icon" #icon>
          <slot name="icon" />
        </template>
        <template v-if="$slots.item" #item="slotProps">
          <slot name="item" :item="slotProps.item" :is-active="slotProps.isActive" :is-selected="slotProps.isSelected" />
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </BaseTypeahead>
    </template>
  </Field>
</template>
