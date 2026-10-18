<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TypeaheadEmits, TypeaheadProps, TypeaheadSlots } from './types.js'
import { computed, useAttrs, useId, useTemplateRef } from 'vue'
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
  hasClear: true,
  debounceMs: 150,
  maxMenuItems: 10,
  minQueryLength: 1,
  showOnFocus: false,
  hasAutoFocus: false,
  required: false,
  optional: false,
})

const emit = defineEmits<TypeaheadEmits<T>>()
defineSlots<TypeaheadSlots<T>>()

const attrs = useAttrs()
const inputId = `astryx-typeahead-${useId()}`
const base = useTemplateRef<{ focus: () => void, blur: () => void }>('base')

/** 新名 disabledMessage 优先，旧名 disabledReason 继续可用。 */
const disabledMessage = computed(() => {
  const message = props.disabledMessage?.trim() ? props.disabledMessage : props.disabledReason
  return message?.trim() ? message : undefined
})
/** 两个名字都是真才画清除按钮，任一个关掉就关掉。 */
const showsClear = computed(() => props.hasClear && props.clearable)
/** 两个名字任一为真就在聚焦时先展开。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
const emptySearchText = computed(() => props.emptySearchText ?? props.emptyText)

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
    :label-tooltip="props.labelTooltip"
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
        v-bind="attrs"
        :model-value="props.modelValue"
        :search-source="props.searchSource"
        :input-id="field.inputId"
        :described-by="field.describedBy"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :disabled-reason="disabledMessage"
        :status="props.status"
        :size="props.size"
        :clearable="showsClear"
        :debounce-ms="props.debounceMs"
        :max-menu-items="props.maxMenuItems"
        :min-query-length="props.minQueryLength"
        :show-on-focus="showsEntriesOnFocus"
        :has-auto-focus="props.hasAutoFocus"
        :empty-search-text="emptySearchText"
        :required="props.required"
        :name="props.name"
        @update:model-value="emit('update:modelValue', $event)"
        @change="emit('change', $event)"
        @search="emit('search', $event)"
        @change-query="emit('changeQuery', $event)"
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
