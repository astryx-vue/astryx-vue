<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TypeaheadEmits, TypeaheadProps, TypeaheadSlots } from './types.js'
import { computed, provide, useAttrs, useId, useTemplateRef } from 'vue'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import Icon from '../Icon/Icon.vue'
import { useInputGroupDisabled } from '../InputGroup/context.js'
import BaseTypeahead from './BaseTypeahead.vue'
import { typeaheadChromeKey, typeaheadFocusKey } from './context.js'
import '../../styles/typeahead.css'

defineOptions({ name: 'AstryxTypeahead', inheritAttrs: false })

const props = withDefaults(defineProps<TypeaheadProps<T>>(), {
  modelValue: null,
  labelHidden: false,
  disabled: false,
  status: 'default',
  statusVariant: 'attached',
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
const parts = useFieldPartStyling({
  component: 'Typeahead',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required'],
})
provide(typeaheadChromeKey, true)
const inputId = `astryx-typeahead-${useId()}`
// 值标签盖住输入框时，dialog 菜单关闭后焦点还给标签的按钮，而不是看不见的输入框。
provide(typeaheadFocusKey, {
  inputReturnTarget: () => document.getElementById(inputId)?.closest('.astryx-typeahead-control')?.querySelector<HTMLElement>('.astryx-token button') ?? null,
})
const base = useTemplateRef<{ focus: () => void, blur: () => void, open: () => void, close: () => void }>('base')

/** 新名 disabledMessage 优先，旧名 disabledReason 继续可用。 */
const disabledMessage = computed(() => {
  const message = props.disabledMessage?.trim() ? props.disabledMessage : props.disabledReason
  return message?.trim() ? message : undefined
})
/** 两个名字都是真才画清除按钮，任一个关掉就关掉。 */
const isDisabled = useInputGroupDisabled(() => props.disabled)
const showsClear = computed(() => props.hasClear && props.clearable)
/** 两个名字任一为真就在聚焦时先展开。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
/** 正名 isLabelHidden，旧名 labelHidden 任一为真就藏起标签。 */
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const emptySearchText = computed(() => props.emptySearchText ?? props.emptyText)

const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})

/** 调用方的 aria-labelledby 接在字段自己的标签后面，不取代它。 */
function labelledBy(fieldLabelId: string): string | undefined {
  const external = attrs['aria-labelledby']
  return typeof external === 'string' && external !== '' ? `${fieldLabelId} ${external}` : undefined
}

defineExpose({
  focus: () => base.value?.focus(),
  blur: () => base.value?.blur(),
  open: () => base.value?.open(),
  close: () => base.value?.close(),
})
</script>

<template>
  <Field
    class="astryx-typeahead"
    :class="[parts.containerClass.value, `size-${props.size}`]"
    :style="parts.containerStyle.value"
    :label="props.label"
    :input-id="inputId"
    :description="props.description"
    :label-tooltip="props.labelTooltip"
    :is-label-hidden="hideLabel"
    :is-disabled="isDisabled"
    :is-required="props.required"
    :is-optional="props.optional"
    :status="fieldStatus"
    :status-variant="props.statusVariant"
    :width="props.width"
  >
    <template #default="field">
      <BaseTypeahead
        ref="base"
        v-bind="{ ...parts.forwardedAttrs(), ariaLabelledBy: labelledBy(field.labelId) }"
        :control-class="parts.controlClass()"
        :control-style="parts.controlStyle()"
        :model-value="props.modelValue"
        :search-source="props.searchSource"
        :input-id="field.inputId"
        :described-by="field.describedBy"
        :label-id="field.labelId"
        :placeholder="props.placeholder"
        :disabled="isDisabled"
        :disabled-reason="disabledMessage"
        :status="props.status"
        :status-message="props.statusMessage"
        :status-variant="props.statusVariant"
        :size="props.size"
        :clearable="showsClear"
        :debounce-ms="props.debounceMs"
        :max-menu-items="props.maxMenuItems"
        :min-query-length="props.minQueryLength"
        :show-on-focus="showsEntriesOnFocus"
        :has-auto-focus="props.hasAutoFocus"
        :empty-search-text="emptySearchText"
        :menu="props.menu"
        :required="props.required"
        :name="props.name"
        @update:model-value="emit('update:modelValue', $event)"
        @change="emit('change', $event)"
        @search="emit('search', $event)"
        @change-query="emit('changeQuery', $event)"
        @open-change="emit('openChange', $event)"
      >
        <template v-if="$slots.icon || props.startIcon" #icon>
          <slot name="icon">
            <Icon v-if="typeof props.startIcon === 'string'" :icon="props.startIcon" size="sm" />
            <component :is="props.startIcon" v-else />
          </slot>
        </template>
        <template v-if="$slots.item" #item="slotProps">
          <slot name="item" :item="slotProps.item" :is-active="slotProps.isActive" :is-selected="slotProps.isSelected" />
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
        <template v-if="$slots.menu" #menu="menuProps">
          <slot name="menu" v-bind="menuProps" />
        </template>
      </BaseTypeahead>
    </template>
  </Field>
</template>
