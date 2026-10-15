<script setup lang="ts">
import type { CheckboxIndicatorProps, CheckboxIndicatorSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { decorativeAttrs } from '../Indicator/decorative.js'
import '../../styles/checkbox-indicator.css'

defineOptions({ name: 'AstryxCheckboxIndicator', inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxIndicatorProps>(), {
  size: 'md',
})

defineSlots<CheckboxIndicatorSlots>()

const attrs = useAttrs()
const element = useTemplateRef<HTMLSpanElement>('indicator')
const passed = computed(() => decorativeAttrs(attrs))

defineExpose({ element })
</script>

<template>
  <span
    v-bind="passed"
    ref="indicator"
    class="astryx-checkbox-indicator"
    aria-hidden="true"
    :data-state="state"
    :data-size="props.size"
    :data-disabled="isDisabled || undefined"
  >
    <!--
      An empty slot, including a spinner hidden by v-if, falls through to the
      marks. A real element in the slot replaces them.
    -->
    <slot>
      <svg class="astryx-checkbox-indicator-check" viewBox="0 0 10 10" focusable="false">
        <path d="M8.5 2.5L4 7.5L1.5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="astryx-checkbox-indicator-dash" />
    </slot>
  </span>
</template>
