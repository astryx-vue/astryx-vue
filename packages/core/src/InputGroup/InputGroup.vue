<script setup lang="ts">
import type { InputGroupProps, InputGroupSlots } from './types.js'
import { computed, provide } from 'vue'
import { INPUT_GROUP_KEY } from './context.js'
import '../../styles/input-group.css'

defineOptions({ name: 'AstryxInputGroup' })

const props = withDefaults(defineProps<InputGroupProps>(), {
  size: 'md',
  disabled: false,
})

defineSlots<InputGroupSlots>()

provide(INPUT_GROUP_KEY, {
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
})
</script>

<template>
  <div class="astryx-input-group" :class="[`size-${props.size}`, { 'is-disabled': props.disabled }]">
    <div v-if="$slots.before" class="astryx-input-group-addon before">
      <slot name="before" />
    </div>
    <div class="astryx-input-group-field">
      <slot />
    </div>
    <div v-if="$slots.after" class="astryx-input-group-addon after">
      <slot name="after" />
    </div>
  </div>
</template>
