<script setup lang="ts">
import type { RadioListItemProps, RadioListItemSlots } from './types.js'
import Radio from '../Radio/Radio.vue'

defineOptions({ name: 'AstryxRadioListItem' })
defineProps<RadioListItemProps>()
defineSlots<RadioListItemSlots>()
</script>

<template>
  <Radio :value="value" :label="label" :description="description" :is-disabled="isDisabled" :is-read-only="isReadOnly">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="$slots.end" #end>
      <slot name="end" />
    </template>
  </Radio>
</template>
