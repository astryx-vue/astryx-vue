<script setup lang="ts">
import type { CheckboxIndicatorProps, CheckboxIndicatorSlots } from './types.js'
import { useAttrs, useTemplateRef } from 'vue'
import '../../styles/checkbox-indicator.css'

defineOptions({ name: 'AstryxCheckboxIndicator', inheritAttrs: false })
withDefaults(defineProps<CheckboxIndicatorProps>(), { size: 'md' })
defineSlots<CheckboxIndicatorSlots>()
const attrs = useAttrs()
const element = useTemplateRef<HTMLSpanElement>('indicator')
defineExpose({ element })
function decorativeAttrs(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith('aria-') && !['role', 'tabindex', 'contenteditable'].includes(key)))
}
</script>

<template>
  <span v-bind="decorativeAttrs()" ref="indicator" class="astryx-checkbox-indicator" aria-hidden="true" :data-state="state" :data-size="size" :data-disabled="isDisabled || undefined">
    <slot>
      <svg class="astryx-checkbox-indicator-check" viewBox="0 0 10 10" focusable="false">
        <path d="M8.5 2.5L4 7.5L1.5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="astryx-checkbox-indicator-dash" />
    </slot>
  </span>
</template>
