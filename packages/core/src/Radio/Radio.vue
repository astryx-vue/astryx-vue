<script setup lang="ts">
import type { RadioEmits, RadioProps, RadioSlots } from './types.js'
import { computed, inject, useAttrs, useId } from 'vue'
import { radioContextKey } from './types.js'

defineOptions({ name: 'AstryxRadio' })
const props = defineProps<RadioProps>()
const emit = defineEmits<RadioEmits>()
defineSlots<RadioSlots>()
const attrs = useAttrs()
const context = inject(radioContextKey, undefined)
const generatedId = `astryx-radio-option-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const name = computed(() => context?.name.value ?? attrs.name as string ?? inputId.value)
const selectedValue = computed(() => context?.selectedValue.value ?? null)
const isSelected = computed(() => selectedValue.value === props.value)
const isDisabled = computed(() => props.isDisabled || context?.isGroupDisabled.value)
const isReadOnly = computed(() => props.isReadOnly || context?.isGroupReadOnly.value)

function change(event: Event): void {
  if (isDisabled.value || isReadOnly.value)
    return
  if (context)
    context.select(props.value, event)
  else
    emit('change', props.value, event as CustomEvent)
}
</script>

<template>
  <label :for="inputId" class="astryx-radio" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined">
    <input
      :id="inputId" class="astryx-radio-native" type="radio" :name="name" :value="value"
      :checked="isSelected" :disabled="isDisabled" :readonly="isReadOnly"
      :aria-describedby="description ? `${inputId}-description` : undefined"
      @change="change"
    >
    <span class="astryx-radio-indicator" aria-hidden="true" />
    <span class="astryx-radio-content">
      <span class="astryx-radio-label">{{ label }}</span>
      <span v-if="description" :id="`${inputId}-description`" class="astryx-radio-description">{{ description }}</span>
    </span>
  </label>
</template>
