<script setup lang="ts">
import type { IndicatorProps } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import { decorativeAttrs } from './decorative.js'
import '../../styles/radio-indicator.css'

defineOptions({ name: 'AstryxRadioIndicator', inheritAttrs: false })

const props = defineProps<IndicatorProps<'singleSelection'>>()

const attrs = useAttrs()
const element = useTemplateRef<HTMLSpanElement>('indicator')
const passed = computed(() => decorativeAttrs(attrs))
const checked = computed(() => props.state !== 'unchecked')

defineExpose({ element })
</script>

<template>
  <span
    v-bind="passed"
    ref="indicator"
    class="astryx-radio-indicator"
    aria-hidden="true"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-size="props.size"
    :data-disabled="isDisabled || undefined"
  >
    <slot>
      <span v-if="checked" class="astryx-radio-indicator-dot" />
    </slot>
  </span>
</template>
