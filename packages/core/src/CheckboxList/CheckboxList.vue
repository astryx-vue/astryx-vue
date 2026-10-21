<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { CheckboxListEmits, CheckboxListProps } from './types.js'
import { computed, provide, ref, useAttrs, useId } from 'vue'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import List from '../List/List.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { checkboxListKey } from './context.js'
import '../../styles/checkbox-list.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxCheckboxList', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<CheckboxListProps, 'modelValue'>>(), {
  density: 'balanced',
  hasDividers: false,
  statusVariant: 'detached',
})

const emit = defineEmits<CheckboxListEmits>()
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'CheckboxList',
  props,
  attrs,
  reservedAttrs: ['aria-labelledby', 'aria-describedby'],
})
const model = defineModel<string[]>()
const generatedId = `astryx-checkbox-list-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const pending = ref<string[]>([])
const optimistic = ref<string[] | null>(null)
const shown = computed(() => optimistic.value ?? model.value)
const groupDisabled = computed(() => props.isDisabled ?? false)
const disabledReason = computed(() => (props.disabledMessage ?? props.disabledReason)?.trim() || undefined)
const showsReason = computed(() => groupDisabled.value && disabledReason.value != null)

function toggle(value: string, checked: boolean): void {
  if (props.isReadOnly || pending.value.includes(value))
    return
  const current = shown.value ?? []
  const next = checked
    ? current.includes(value) ? current : [...current, value]
    : current.filter(item => item !== value)
  model.value = next
  emit('change', next)
  const action = props.changeAction
  if (action == null)
    return
  optimistic.value = next
  pending.value = [...pending.value, value]
  void Promise.resolve(action(next)).finally(() => {
    pending.value = pending.value.filter(item => item !== value)
    if (pending.value.length === 0)
      optimistic.value = null
  })
}

function groupLabelledBy(labelId?: string): string | undefined {
  return [labelId, attrs['aria-labelledby']].filter(Boolean).join(' ') || undefined
}
function groupDescribedBy(fieldDescribed?: string): string | undefined {
  return [attrs['aria-describedby'], fieldDescribed, showsReason.value ? `${inputId.value}-reason` : undefined].filter(Boolean).join(' ') || undefined
}

provide(checkboxListKey, {
  values: shown,
  toggle,
  isDisabled: groupDisabled,
  disabledReason,
  isReadOnly: computed(() => (props.isReadOnly ?? false) && !groupDisabled.value),
  loadingValues: computed(() => pending.value),
  size: computed(() => props.density === 'compact' ? 'sm' : 'md'),
})
</script>

<template>
  <Field
    class="astryx-checkbox-list" :class="[attrs.class, parts.containerClass.value]" :style="[attrs.style as StyleValue, parts.containerStyle.value]"
    :label="label" :input-id="inputId" is-group-label
    :description="description" :width="width" :is-label-hidden="isLabelHidden" :is-disabled="isDisabled"
    :is-optional="isOptional" :is-required="isRequired" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <Tooltip :content="disabledReason" :is-enabled="showsReason" focus-trigger="always" placement="above">
        <div
          class="astryx-checkbox-list-control" :class="controlClass" :style="controlStyle" role="group"
          v-bind="parts.forwardedAttrs()" :aria-labelledby="groupLabelledBy(field.labelId)" :aria-describedby="groupDescribedBy(field.describedBy)"
        >
          <List :density="density" :has-dividers="hasDividers">
            <slot />
          </List>
        </div>
      </Tooltip>
      <span v-if="showsReason" :id="`${inputId}-reason`" class="astryx-visually-hidden">{{ disabledReason }}</span>
    </template>
  </Field>
</template>
