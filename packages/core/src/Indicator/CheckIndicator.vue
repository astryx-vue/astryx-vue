<script setup lang="ts">
import type { IndicatorProps } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { decorativeAttrs } from './decorative.js'
import { useReplacementSlot } from './useReplacementSlot.js'
import '../../styles/check-indicator.css'

defineOptions({ name: 'AstryxCheckIndicator', inheritAttrs: false })

const props = withDefaults(defineProps<IndicatorProps<'singleSelection'>>(), {
  size: 'md',
})

const attrs = useAttrs()
const element = useTemplateRef<HTMLElement>('mark')
const passed = computed(() => decorativeAttrs(attrs))
const replacement = useReplacementSlot()

defineExpose({ element })
</script>

<template>
  <span
    v-if="replacement()"
    ref="mark"
    v-bind="passed"
    class="astryx-check-indicator"
    aria-hidden="true"
    :data-size="props.size"
    :data-disabled="isDisabled || undefined"
  >
    <slot />
  </span>
  <Icon
    v-else-if="state === 'checked'"
    ref="mark"
    v-bind="passed"
    icon="check"
    size="sm"
    :color="isDisabled ? 'disabled' : 'accent'"
    aria-hidden="true"
  />
</template>
